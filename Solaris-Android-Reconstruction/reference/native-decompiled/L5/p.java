package L5;

import com.facebook.react.fabric.mounting.mountitems.IntBufferBatchMountItem;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.CodingErrorAction;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import kotlin.Pair;
import p027d5.C0681d;
import p143v3.AbstractC0975j;
import p143v3.AbstractC0982q;
import p143v3.J;
import p143v3.L;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class p {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final p f1844a = new p();

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private static final String[] f1845b = {"application/pdf", "image/png", "image/jpeg", "text/plain"};

    private p() {
    }

    public static /* synthetic */ CharSequence a(byte b6) {
        return h(b6);
    }

    private final boolean f(byte[] bArr, int[] iArr) {
        if (bArr.length < iArr.length) {
            return false;
        }
        Iterable iterableH = AbstractC0975j.H(iArr);
        if ((iterableH instanceof Collection) && ((Collection) iterableH).isEmpty()) {
            return true;
        }
        Iterator it = iterableH.iterator();
        while (it.hasNext()) {
            int iNextInt = ((J) it).nextInt();
            if ((bArr[iNextInt] & 255) != iArr[iNextInt]) {
                return false;
            }
        }
        return true;
    }

    private static final CharSequence h(byte b6) {
        String str = String.format("%02x", Arrays.copyOf(new Object[]{Byte.valueOf(b6)}, 1));
        J3.l.e(str, "format(...)");
        return str;
    }

    public final String b(String str) {
        if (str == null) {
            str = "Supporting file";
        }
        String strG1 = p027d5.q.g1(p027d5.q.Y0(new p027d5.o("[/\\\\\\x00-\\x1f\\x7f\\u202a-\\u202e\\u2066-\\u2069]").f(str, "_")).toString(), 160);
        return (p027d5.q.d0(strG1) || J3.l.b(strG1, ".") || J3.l.b(strG1, "..")) ? "Supporting file" : strG1;
    }

    public final String[] c() {
        return f1845b;
    }

    public final String d(byte[] bArr) {
        byte b6;
        byte b7;
        J3.l.f(bArr, "bytes");
        if ((bArr.length == 0) || bArr.length > 1048576) {
            throw new IllegalArgumentException("ATTACHMENT_SIZE");
        }
        if (f(bArr, new int[]{137, 80, 78, 71, 13, 10, 26, 10})) {
            int[] iArr = {0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130};
            if (bArr.length >= 45) {
                Iterable iterableH = AbstractC0975j.H(iArr);
                if ((iterableH instanceof Collection) && ((Collection) iterableH).isEmpty()) {
                    return "image/png";
                }
                Iterator it = iterableH.iterator();
                while (it.hasNext()) {
                    int iNextInt = ((J) it).nextInt();
                    if ((bArr[(bArr.length - 12) + iNextInt] & 255) == iArr[iNextInt]) {
                    }
                }
                return "image/png";
            }
            throw new IllegalArgumentException("ATTACHMENT_TYPE");
        }
        if (f(bArr, new int[]{255, 216, 255})) {
            if (bArr.length >= 4 && bArr[bArr.length - 2] == -1 && AbstractC0975j.c0(bArr) == -39) {
                return "image/jpeg";
            }
            throw new IllegalArgumentException("ATTACHMENT_TYPE");
        }
        if (f(bArr, new int[]{37, 80, 68, 70, 45})) {
            String str = new String(bArr, Math.max(0, bArr.length - IntBufferBatchMountItem.INSTRUCTION_UPDATE_OVERFLOW_INSET), Math.min(bArr.length, IntBufferBatchMountItem.INSTRUCTION_UPDATE_OVERFLOW_INSET), C0681d.f11153g);
            if (bArr.length < 12 || 49 > (b6 = bArr[5]) || b6 >= 51 || bArr[6] != 46 || 48 > (b7 = bArr[7]) || b7 >= 58 || !new p027d5.o("%%EOF[\\t\\r\\n ]*$").a(str)) {
                throw new IllegalArgumentException("ATTACHMENT_TYPE");
            }
            return "application/pdf";
        }
        try {
            CharsetDecoder charsetDecoderNewDecoder = C0681d.f11148b.newDecoder();
            CodingErrorAction codingErrorAction = CodingErrorAction.REPORT;
            CharBuffer charBufferDecode = charsetDecoderNewDecoder.onMalformedInput(codingErrorAction).onUnmappableCharacter(codingErrorAction).decode(ByteBuffer.wrap(bArr));
            J3.l.c(charBufferDecode);
            for (int i6 = 0; i6 < charBufferDecode.length(); i6++) {
                char cCharAt = charBufferDecode.charAt(i6);
                if ((cCharAt < ' ' && !p027d5.q.N("\t\r\n", cCharAt, false, 2, null)) || (127 <= cCharAt && cCharAt < 160)) {
                    throw new IllegalArgumentException("ATTACHMENT_TYPE");
                }
            }
            return "text/plain";
        } catch (Exception unused) {
            throw new IllegalStateException("ATTACHMENT_TYPE");
        }
    }

    /* JADX WARN: Bottom block not found for handler: all -> 0x0130 */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public final java.util.Map e(android.content.Context r12, android.net.Uri r13, L5.p$a r14) throws java.lang.Throwable {
        /*
            Method dump skipped, instruction units count: 337
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: L5.p.e(android.content.Context, android.net.Uri, L5.p$a):java.util.Map");
    }

    public final Map g(byte[] bArr, String str, String str2) {
        J3.l.f(bArr, "bytes");
        String strD = d(bArr);
        if (str2 != null && !AbstractC0982q.m("application/octet-stream", "*/*").contains(str2) && !J3.l.b(str2, strD)) {
            throw new IllegalArgumentException("ATTACHMENT_TYPE");
        }
        Pair pairA = p137u3.s.a("filename", b(str));
        Pair pairA2 = p137u3.s.a("mimeType", strD);
        Pair pairA3 = p137u3.s.a("byteLength", Integer.valueOf(bArr.length));
        byte[] bArrDigest = MessageDigest.getInstance("SHA-256").digest(bArr);
        J3.l.e(bArrDigest, "digest(...)");
        return L.l(pairA, pairA2, pairA3, p137u3.s.a("sha256", AbstractC0975j.Z(bArrDigest, "", null, null, 0, null, new o(), 30, null)), p137u3.s.a("contentBase64", Base64.getEncoder().encodeToString(bArr)));
    }
}
