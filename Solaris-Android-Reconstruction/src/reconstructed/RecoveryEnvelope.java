package reconstructed;

import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.text.Normalizer;
import java.util.Arrays;
import java.util.Objects;
import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * Isolated reconstruction of code601 L5/b.java. This is not wired to Android,
 * a vault, a keystore, a recovery importer, or an APK build.
 * See docs/RECOVERY-CODEC.md for evidence, limits, and method correspondence.
 */
public final class RecoveryEnvelope {
    private static final byte[] MAGIC = "SVCORE1\n".getBytes(StandardCharsets.US_ASCII);
    private static final int MAX_PLAINTEXT_BYTES = 16_777_216;
    private static final int HEADER_BYTES = 56;
    private static final int TAG_BYTES = 16;

    private RecoveryEnvelope() {}

    /** L5/b.a: validate the envelope structure, authenticate, and decrypt raw bytes. */
    public static byte[] decrypt(byte[] bytes, char[] pass) throws GeneralSecurityException {
        Objects.requireNonNull(bytes, "bytes");
        Objects.requireNonNull(pass, "pass");
        if (bytes.length < 73 || bytes.length >= 16_777_289
                || !Arrays.equals(Arrays.copyOfRange(bytes, 0, 8), MAGIC)) {
            throw new IllegalArgumentException("RECOVERY_INVALID");
        }
        int plainLength = ByteBuffer.wrap(bytes, 52, 4).getInt();
        if (plainLength < 1 || plainLength > MAX_PLAINTEXT_BYTES
                || bytes.length != plainLength + HEADER_BYTES + TAG_BYTES) {
            throw new IllegalArgumentException("RECOVERY_INVALID");
        }
        byte[] key = deriveKey(pass, Arrays.copyOfRange(bytes, 8, 40));
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key, "AES"),
                    new GCMParameterSpec(128, Arrays.copyOfRange(bytes, 40, 52)));
            cipher.updateAAD(bytes, 0, HEADER_BYTES);
            return cipher.doFinal(bytes, HEADER_BYTES, bytes.length - HEADER_BYTES);
        } finally {
            Arrays.fill(key, (byte) 0);
        }
    }

    /** L5/b.b: derive the 256-bit envelope key; caller owns and must clear the result. */
    public static byte[] deriveKey(char[] raw, byte[] salt) throws GeneralSecurityException {
        Objects.requireNonNull(raw, "raw");
        Objects.requireNonNull(salt, "salt");
        if (salt.length != 32) {
            throw new IllegalArgumentException("RECOVERY_INVALID");
        }
        char[] normalized = normalizePassphrase(raw);
        PBEKeySpec spec = new PBEKeySpec(normalized, salt, 600_000, 256);
        try {
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
                    .generateSecret(spec).getEncoded();
        } finally {
            Arrays.fill(normalized, '\0');
            spec.clearPassword();
        }
    }

    /** L5/b.c: encrypt raw bytes with freshly generated 32-byte salt and 12-byte nonce. */
    public static byte[] encrypt(byte[] plain, char[] pass) throws GeneralSecurityException {
        Objects.requireNonNull(plain, "plain");
        Objects.requireNonNull(pass, "pass");
        if (plain.length == 0 || plain.length > MAX_PLAINTEXT_BYTES) {
            throw new IllegalArgumentException("RECOVERY_SIZE");
        }
        byte[] salt = new byte[32];
        byte[] nonce = new byte[12];
        SecureRandom random = new SecureRandom();
        random.nextBytes(salt);
        random.nextBytes(nonce);
        byte[] header = ByteBuffer.allocate(HEADER_BYTES)
                .put(MAGIC).put(salt).put(nonce).putInt(plain.length).array();
        byte[] key = deriveKey(pass, salt);
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key, "AES"),
                    new GCMParameterSpec(128, nonce));
            cipher.updateAAD(header);
            byte[] ciphertextAndTag = cipher.doFinal(plain);
            byte[] result = Arrays.copyOf(header, HEADER_BYTES + ciphertextAndTag.length);
            System.arraycopy(ciphertextAndTag, 0, result, HEADER_BYTES, ciphertextAndTag.length);
            return result;
        } finally {
            Arrays.fill(key, (byte) 0);
        }
    }

    /**
     * L5/b.d: NFC, at least 20 Unicode code points, at most 1024 Java UTF-8 bytes.
     * Deliberately preserves Java getBytes replacement semantics for malformed UTF-16.
     */
    public static char[] normalizePassphrase(char[] raw) {
        Objects.requireNonNull(raw, "raw");
        String normalized = Normalizer.normalize(new String(raw), Normalizer.Form.NFC);
        if (normalized.codePointCount(0, normalized.length()) >= 20
                && normalized.getBytes(StandardCharsets.UTF_8).length <= 1024) {
            return normalized.toCharArray();
        }
        throw new IllegalArgumentException("RECOVERY_PASSPHRASE_LENGTH");
    }

    /** L5/b.e: strict UTF-8 is a separate operation, never implicit in decrypt(). */
    public static String decodeUtf8(byte[] bytes) throws CharacterCodingException {
        Objects.requireNonNull(bytes, "bytes");
        return StandardCharsets.UTF_8.newDecoder()
                .onMalformedInput(CodingErrorAction.REPORT)
                .onUnmappableCharacter(CodingErrorAction.REPORT)
                .decode(ByteBuffer.wrap(bytes)).toString();
    }

    /** L5/b.f: verify a lowercase SHA-256 HMAC hex string for at most 65536 body bytes. */
    public static boolean verifyReceiptMac(String body, byte[] key, String expected)
            throws GeneralSecurityException {
        Objects.requireNonNull(body, "body");
        Objects.requireNonNull(key, "key");
        Objects.requireNonNull(expected, "expected");
        byte[] bodyBytes = body.getBytes(StandardCharsets.UTF_8);
        if (bodyBytes.length > 65_536 || !expected.matches("[a-f0-9]{64}")) {
            return false;
        }
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key, "HmacSHA256"));
        byte[] actual = mac.doFinal(bodyBytes);
        byte[] expectedBytes = new byte[32];
        for (int i = 0; i < expectedBytes.length; i++) {
            expectedBytes[i] = (byte) Integer.parseInt(expected.substring(i * 2, i * 2 + 2), 16);
        }
        return MessageDigest.isEqual(actual, expectedBytes);
    }
}
