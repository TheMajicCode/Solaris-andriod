package L5;

import com.facebook.react.fabric.mounting.mountitems.IntBufferBatchMountItem;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.CodingErrorAction;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.text.Normalizer;
import java.text.Normalizer$Form;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import p027d5.AbstractC0678a;
import p027d5.C0681d;
import p143v3.AbstractC0975j;
import p143v3.AbstractC0982q;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class b {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final b f1735a = new b();

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private static final byte[] f1736b;

    static {
        byte[] bytes = "SVCORE1\n".getBytes(C0681d.f11152f);
        J3.l.e(bytes, "getBytes(...)");
        f1736b = bytes;
    }

    private b() {
    }

    public final byte[] a(byte[] bArr, char[] cArr) {
        J3.l.f(bArr, "bytes");
        J3.l.f(cArr, "pass");
        int length = bArr.length;
        if (73 > length || length >= 16777289 || !Arrays.equals(AbstractC0975j.j(bArr, 0, 8), f1736b)) {
            throw new IllegalArgumentException("RECOVERY_INVALID");
        }
        int i6 = ByteBuffer.wrap(bArr, 52, 4).getInt();
        if (1 > i6 || i6 >= 16777217 || bArr.length != i6 + 72) {
            throw new IllegalArgumentException("RECOVERY_INVALID");
        }
        byte[] bArrB = b(cArr, AbstractC0975j.j(bArr, 8, 40));
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(2, new SecretKeySpec(bArrB, "AES"), new GCMParameterSpec(IntBufferBatchMountItem.INSTRUCTION_UPDATE_LAYOUT, AbstractC0975j.j(bArr, 40, 52)));
            cipher.updateAAD(bArr, 0, 56);
            byte[] bArrDoFinal = cipher.doFinal(bArr, 56, bArr.length - 56);
            J3.l.c(bArrDoFinal);
            return bArrDoFinal;
        } finally {
            AbstractC0975j.o(bArrB, (byte) 0, 0, 0, 6, null);
        }
    }

    public final byte[] b(char[] cArr, byte[] bArr) {
        J3.l.f(cArr, "raw");
        J3.l.f(bArr, "salt");
        if (bArr.length != 32) {
            throw new IllegalArgumentException("RECOVERY_INVALID");
        }
        char[] cArrD = d(cArr);
        PBEKeySpec pBEKeySpec = new PBEKeySpec(cArrD, bArr, 600000, IntBufferBatchMountItem.INSTRUCTION_UPDATE_EVENT_EMITTER);
        try {
            byte[] encoded = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(pBEKeySpec).getEncoded();
            J3.l.c(encoded);
            return encoded;
        } finally {
            AbstractC0975j.p(cArrD, (char) 0, 0, 0, 6, null);
            pBEKeySpec.clearPassword();
        }
    }

    public final byte[] c(byte[] bArr, char[] cArr) {
        J3.l.f(bArr, "plain");
        J3.l.f(cArr, "pass");
        if ((bArr.length == 0) || bArr.length > 16777216) {
            throw new IllegalArgumentException("RECOVERY_SIZE");
        }
        byte[] bArr2 = new byte[32];
        byte[] bArr3 = new byte[12];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(bArr2);
        secureRandom.nextBytes(bArr3);
        byte[] bArrArray = ByteBuffer.allocate(56).put(f1736b).put(bArr2).put(bArr3).putInt(bArr.length).array();
        byte[] bArrB = b(cArr, bArr2);
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(1, new SecretKeySpec(bArrB, "AES"), new GCMParameterSpec(IntBufferBatchMountItem.INSTRUCTION_UPDATE_LAYOUT, bArr3));
            cipher.updateAAD(bArrArray);
            J3.l.c(bArrArray);
            byte[] bArrDoFinal = cipher.doFinal(bArr);
            J3.l.e(bArrDoFinal, "doFinal(...)");
            return AbstractC0975j.r(bArrArray, bArrDoFinal);
        } finally {
            AbstractC0975j.o(bArrB, (byte) 0, 0, 0, 6, null);
        }
    }

    public final char[] d(char[] cArr) {
        J3.l.f(cArr, "raw");
        String strNormalize = Normalizer.normalize(new String(cArr), Normalizer$Form.NFC);
        J3.l.c(strNormalize);
        if (strNormalize.codePointCount(0, strNormalize.length()) >= 20) {
            byte[] bytes = strNormalize.getBytes(C0681d.f11148b);
            J3.l.e(bytes, "getBytes(...)");
            if (bytes.length <= 1024) {
                char[] charArray = strNormalize.toCharArray();
                J3.l.e(charArray, "toCharArray(...)");
                return charArray;
            }
        }
        throw new IllegalArgumentException("RECOVERY_PASSPHRASE_LENGTH");
    }

    public final String e(byte[] bArr) {
        J3.l.f(bArr, "bytes");
        CharsetDecoder charsetDecoderNewDecoder = C0681d.f11148b.newDecoder();
        CodingErrorAction codingErrorAction = CodingErrorAction.REPORT;
        String string = charsetDecoderNewDecoder.onMalformedInput(codingErrorAction).onUnmappableCharacter(codingErrorAction).decode(ByteBuffer.wrap(bArr)).toString();
        J3.l.e(string, "toString(...)");
        return string;
    }

    public final boolean f(String str, byte[] bArr, String str2) throws NoSuchAlgorithmException, InvalidKeyException {
        J3.l.f(str, "body");
        J3.l.f(bArr, "key");
        J3.l.f(str2, "expected");
        Charset charset = C0681d.f11148b;
        byte[] bytes = str.getBytes(charset);
        J3.l.e(bytes, "getBytes(...)");
        if (bytes.length > 65536 || !new p027d5.o("[a-f0-9]{64}").e(str2)) {
            return false;
        }
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(bArr, "HmacSHA256"));
        byte[] bytes2 = str.getBytes(charset);
        J3.l.e(bytes2, "getBytes(...)");
        byte[] bArrDoFinal = mac.doFinal(bytes2);
        List listC1 = p027d5.q.c1(str2, 2);
        ArrayList arrayList = new ArrayList(AbstractC0982q.u(listC1, 10));
        Iterator it = listC1.iterator();
        while (it.hasNext()) {
            arrayList.add(Byte.valueOf((byte) Integer.parseInt((String) it.next(), AbstractC0678a.a(16))));
        }
        return MessageDigest.isEqual(bArrDoFinal, AbstractC0982q.G0(arrayList));
    }
}
