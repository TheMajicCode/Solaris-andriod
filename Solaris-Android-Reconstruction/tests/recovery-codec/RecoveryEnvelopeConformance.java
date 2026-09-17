package reconstructed;

import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.HexFormat;
import java.util.Properties;

/** Synthetic-only harness. No Android APIs, device access, or real vault inputs. */
public final class RecoveryEnvelopeConformance {
    private static int checks;
    private static final char[] PASS = "synthetic-passphrase-20-plus".toCharArray();

    @FunctionalInterface
    private interface CheckedAction { void run() throws Exception; }

    private static void check(String name, boolean condition) {
        if (!condition) throw new AssertionError(name);
        checks++;
        System.out.println("PASS " + name);
    }

    private static void rejects(String name, Class<? extends Throwable> type,
            String message, CheckedAction action) throws Exception {
        try {
            action.run();
        } catch (Throwable error) {
            check(name, type.isInstance(error)
                    && (message == null || message.equals(error.getMessage())));
            return;
        }
        throw new AssertionError("Expected rejection: " + name);
    }

    private static String text(Path file) throws Exception {
        return Files.readString(file, StandardCharsets.UTF_8);
    }

    private static void invalid(String name, byte[] envelope) throws Exception {
        rejects(name, IllegalArgumentException.class, "RECOVERY_INVALID",
                () -> RecoveryEnvelope.decrypt(envelope, PASS));
    }

    private static void badPass(String name, String pass) throws Exception {
        rejects(name, IllegalArgumentException.class, "RECOVERY_PASSPHRASE_LENGTH",
                () -> RecoveryEnvelope.normalizePassphrase(pass.toCharArray()));
    }

    public static void main(String[] args) throws Exception {
        Path fixtures = Path.of(args[0]);
        Path exports = Path.of(args[1]);
        Files.createDirectories(exports);
        Properties receipt = new Properties();
        try (var stream = Files.newInputStream(fixtures.resolve("receipts.properties"))) {
            receipt.load(stream);
        }

        for (String name : new String[]{"minimum", "unicode", "binary"}) {
            byte[] envelope = Files.readAllBytes(fixtures.resolve(name + ".envelope"));
            byte[] plain = Files.readAllBytes(fixtures.resolve(name + ".plain"));
            char[] pass = text(fixtures.resolve(name + ".pass")).toCharArray();
            char[] originalPass = pass.clone();
            byte[] originalEnvelope = envelope.clone();
            byte[] salt = Arrays.copyOfRange(envelope, 8, 40);
            byte[] key = RecoveryEnvelope.deriveKey(pass, salt);
            check(name + " Python PBKDF2 key matches Java",
                    Arrays.equals(key, Files.readAllBytes(fixtures.resolve(name + ".key"))));
            Arrays.fill(key, (byte) 0);
            check(name + " Python encrypt to Java decrypt exact bytes",
                    Arrays.equals(RecoveryEnvelope.decrypt(envelope, pass), plain));
            check(name + " decrypt leaves caller arrays intact",
                    Arrays.equals(pass, originalPass) && Arrays.equals(envelope, originalEnvelope));
            byte[] encrypted = RecoveryEnvelope.encrypt(plain, pass);
            check(name + " generated envelope structural length", encrypted.length == plain.length + 72);
            check(name + " generated envelope big endian length",
                    ByteBuffer.wrap(encrypted, 52, 4).getInt() == plain.length);
            check(name + " generated envelope plaintext roundtrip",
                    Arrays.equals(RecoveryEnvelope.decrypt(encrypted, pass), plain));
            check(name + " encrypt leaves caller passphrase intact", Arrays.equals(pass, originalPass));
            Files.write(exports.resolve(name + ".envelope"), encrypted);
        }

        byte[] baseline = Files.readAllBytes(fixtures.resolve("minimum.envelope"));
        char[] baselinePass = text(fixtures.resolve("minimum.pass")).toCharArray();
        rejects("wrong password authenticates nothing", GeneralSecurityException.class, null,
                () -> RecoveryEnvelope.decrypt(baseline, PASS));
        for (int offset : new int[]{8, 39, 40, 51, 56, baseline.length - 1}) {
            byte[] modified = baseline.clone();
            modified[offset] ^= 1;
            rejects("tampered authenticated byte offset " + offset,
                    GeneralSecurityException.class, null,
                    () -> RecoveryEnvelope.decrypt(modified, baselinePass));
        }
        byte[] lengthAndPayload = Arrays.copyOf(baseline, baseline.length + 1);
        ByteBuffer.wrap(lengthAndPayload, 52, 4).putInt(2);
        rejects("self-consistent modified length is still authenticated",
                GeneralSecurityException.class, null,
                () -> RecoveryEnvelope.decrypt(lengthAndPayload, baselinePass));

        for (int length : new int[]{0, 1, 7, 8, 51, 52, 55, 56, 71, 72}) {
            invalid("short envelope " + length, Arrays.copyOf(baseline, length));
        }
        invalid("oversized envelope inclusive rejected boundary", new byte[16_777_289]);
        invalid("extra trailing byte rejected", Arrays.copyOf(baseline, baseline.length + 1));
        for (int offset = 0; offset < 8; offset++) {
            byte[] modified = baseline.clone();
            modified[offset] ^= 1;
            invalid("magic mismatch " + offset, modified);
        }
        for (int size : new int[]{0, -1, Integer.MIN_VALUE, 2, 16_777_216, 16_777_217}) {
            byte[] modified = baseline.clone();
            ByteBuffer.wrap(modified, 52, 4).putInt(size);
            invalid("invalid or mismatched declared length " + size, modified);
        }
        byte[] wrongEndian = baseline.clone();
        wrongEndian[52] = 1;
        wrongEndian[55] = 0;
        invalid("little endian one does not become big endian one", wrongEndian);
        rejects("empty plaintext", IllegalArgumentException.class, "RECOVERY_SIZE",
                () -> RecoveryEnvelope.encrypt(new byte[0], PASS));
        rejects("plaintext above maximum", IllegalArgumentException.class, "RECOVERY_SIZE",
                () -> RecoveryEnvelope.encrypt(new byte[16_777_217], PASS));
        for (int length : new int[]{0, 31, 33}) {
            rejects("salt length " + length, IllegalArgumentException.class, "RECOVERY_INVALID",
                    () -> RecoveryEnvelope.deriveKey(PASS, new byte[length]));
        }
        rejects("invalid structure precedes passphrase length check", IllegalArgumentException.class,
                "RECOVERY_INVALID", () -> RecoveryEnvelope.decrypt(new byte[0], new char[0]));
        rejects("invalid salt precedes passphrase length check", IllegalArgumentException.class,
                "RECOVERY_INVALID", () -> RecoveryEnvelope.deriveKey(new char[0], new byte[0]));
        rejects("invalid plaintext size precedes passphrase length check", IllegalArgumentException.class,
                "RECOVERY_SIZE", () -> RecoveryEnvelope.encrypt(new byte[0], new char[0]));

        badPass("19 ASCII codepoints rejected", "a".repeat(19));
        badPass("19 astral codepoints rejected despite 38 UTF-16 units", "\ud83c\udf31".repeat(19));
        badPass("19 decomposed characters rejected after NFC", "e\u0301".repeat(19));
        check("20 ASCII codepoints accepted", RecoveryEnvelope.normalizePassphrase("a".repeat(20).toCharArray()).length == 20);
        check("20 astral codepoints accepted", RecoveryEnvelope.normalizePassphrase("\ud83c\udf31".repeat(20).toCharArray()).length == 40);
        check("NFC normalization preserved exactly", new String(RecoveryEnvelope.normalizePassphrase(
                "e\u0301".repeat(20).toCharArray())).equals("\u00e9".repeat(20)));
        check("1024 ASCII bytes accepted", RecoveryEnvelope.normalizePassphrase("a".repeat(1024).toCharArray()).length == 1024);
        badPass("1025 ASCII bytes rejected", "a".repeat(1025));
        check("1024 astral UTF-8 bytes accepted", RecoveryEnvelope.normalizePassphrase("\ud83c\udf31".repeat(256).toCharArray()).length == 512);
        badPass("1028 astral UTF-8 bytes rejected", "\ud83c\udf31".repeat(257));
        check("byte cap applies after NFC", RecoveryEnvelope.normalizePassphrase("e\u0301".repeat(512).toCharArray()).length == 512);
        check("spaces not trimmed", new String(RecoveryEnvelope.normalizePassphrase(" ".repeat(20).toCharArray())).equals(" ".repeat(20)));
        check("NULs not trimmed", new String(RecoveryEnvelope.normalizePassphrase(("a".repeat(19) + "\0").toCharArray())).endsWith("\0"));
        check("normalizer preserves malformed UTF-16 per original getBytes rule",
                RecoveryEnvelope.normalizePassphrase(("a".repeat(19) + "\ud800").toCharArray())[19] == '\ud800');
        byte[] second = RecoveryEnvelope.encrypt(new byte[]{0}, baselinePass);
        byte[] third = RecoveryEnvelope.encrypt(new byte[]{0}, baselinePass);
        check("two exports have different random salts", !Arrays.equals(Arrays.copyOfRange(second, 8, 40), Arrays.copyOfRange(third, 8, 40)));
        check("two exports have different random nonces", !Arrays.equals(Arrays.copyOfRange(second, 40, 52), Arrays.copyOfRange(third, 40, 52)));

        check("UTF-8 empty allowed", RecoveryEnvelope.decodeUtf8(new byte[0]).isEmpty());
        check("UTF-8 Unicode valid", RecoveryEnvelope.decodeUtf8("Hola \u00e9 \ud83c\udf31".getBytes(StandardCharsets.UTF_8)).equals("Hola \u00e9 \ud83c\udf31"));
        check("UTF-8 BOM preserved", RecoveryEnvelope.decodeUtf8(new byte[]{(byte)0xef, (byte)0xbb, (byte)0xbf}).equals("\ufeff"));
        for (String hex : new String[]{"80", "c0af", "eda080", "f4908080", "e282", "ff"}) {
            rejects("strict UTF-8 rejects " + hex, CharacterCodingException.class, null,
                    () -> RecoveryEnvelope.decodeUtf8(HexFormat.of().parseHex(hex)));
        }

        byte[] receiptKey = HexFormat.of().parseHex(receipt.getProperty("key"));
        String receiptBody = text(fixtures.resolve("receipt.body"));
        String receiptMac = receipt.getProperty("body");
        check("Python HMAC matches Unicode exact receipt body", RecoveryEnvelope.verifyReceiptMac(receiptBody, receiptKey, receiptMac));
        check("empty receipt body allowed", RecoveryEnvelope.verifyReceiptMac("", receiptKey, receipt.getProperty("empty")));
        check("receipt body is not normalized", !RecoveryEnvelope.verifyReceiptMac(receiptBody.replace("\u00e9", "e\u0301"), receiptKey, receiptMac));
        check("receipt body changes rejected", !RecoveryEnvelope.verifyReceiptMac(receiptBody + " ", receiptKey, receiptMac));
        byte[] wrongKey = receiptKey.clone();
        wrongKey[0] ^= 1;
        check("receipt key change rejected", !RecoveryEnvelope.verifyReceiptMac(receiptBody, wrongKey, receiptMac));
        check("wrong valid hex MAC rejected", !RecoveryEnvelope.verifyReceiptMac(receiptBody, receiptKey, "0".repeat(64)));
        for (String expected : new String[]{"", "a".repeat(63), "a".repeat(65), "g".repeat(64), receiptMac.toUpperCase(), receiptMac + "\n", " " + receiptMac}) {
            check("invalid expected MAC syntax " + checks, !RecoveryEnvelope.verifyReceiptMac(receiptBody, receiptKey, expected));
        }
        check("65536 ASCII receipt bytes allowed", RecoveryEnvelope.verifyReceiptMac("x".repeat(65536), receiptKey, receipt.getProperty("limit_ascii")));
        check("65537 ASCII receipt bytes rejected", !RecoveryEnvelope.verifyReceiptMac("x".repeat(65537), receiptKey, receipt.getProperty("over_ascii")));
        check("65536 multibyte receipt bytes allowed", RecoveryEnvelope.verifyReceiptMac("\u00e9".repeat(32768), receiptKey, receipt.getProperty("limit_unicode")));
        check("65538 multibyte receipt bytes rejected", !RecoveryEnvelope.verifyReceiptMac("\u00e9".repeat(32769), receiptKey, receipt.getProperty("over_unicode")));
        check("malformed receipt UTF-16 Java replacement retained", RecoveryEnvelope.verifyReceiptMac("\ud800", receiptKey, receipt.getProperty("replacement")));
        check("bad syntax returns false before invalid empty key", !RecoveryEnvelope.verifyReceiptMac("", new byte[0], ""));
        check("overlimit returns false before invalid empty key", !RecoveryEnvelope.verifyReceiptMac("x".repeat(65537), new byte[0], "0".repeat(64)));
        rejects("valid expected shape preserves JCA empty-key exception", IllegalArgumentException.class, null,
                () -> RecoveryEnvelope.verifyReceiptMac("", new byte[0], "0".repeat(64)));

        // One boundary-size export also goes to the independent Python decryptor.
        byte[] maximum = new byte[16_777_216];
        for (int i = 0; i < maximum.length; i++) maximum[i] = (byte) i;
        byte[] maximumEnvelope = RecoveryEnvelope.encrypt(maximum, PASS);
        check("maximum plaintext exports exact envelope limit", maximumEnvelope.length == 16_777_288);
        check("maximum envelope decrypts exact bytes", Arrays.equals(maximum, RecoveryEnvelope.decrypt(maximumEnvelope, PASS)));
        Files.write(exports.resolve("maximum.envelope"), maximumEnvelope);
        System.out.println("JAVA_CHECKS=" + checks);
    }
}
