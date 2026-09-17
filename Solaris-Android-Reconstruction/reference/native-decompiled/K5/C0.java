package K5;

import com.facebook.react.views.progressbar.ReactProgressBarViewManager;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicBoolean;
import kotlin.jvm.functions.Function1;
import p143v3.AbstractC0975j;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0 {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final C0 f1490a = new C0();

    private C0() {
    }

    public static /* synthetic */ CharSequence a(byte b6) {
        return c(b6);
    }

    private static final CharSequence c(byte b6) {
        String str = String.format("%02x", Arrays.copyOf(new Object[]{Byte.valueOf(b6)}, 1));
        J3.l.e(str, "format(...)");
        return str;
    }

    /* JADX WARN: Code duplicated, block: B:77:0x011c  */
    /* JADX WARN: Code duplicated, block: B:79:0x0121  */
    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r15v1 */
    /* JADX WARN: Type inference failed for: r15v2 */
    /* JADX WARN: Type inference failed for: r15v4 */
    /* JADX WARN: Type inference failed for: r15v5 */
    /* JADX WARN: Type inference failed for: r15v6, types: [java.io.FileOutputStream] */
    /* JADX WARN: Type inference failed for: r15v7 */
    /* JADX WARN: Type inference failed for: r16v0 */
    /* JADX WARN: Type inference failed for: r16v1, types: [java.io.FileOutputStream] */
    /* JADX WARN: Type inference failed for: r16v10 */
    /* JADX WARN: Type inference failed for: r16v12, types: [int] */
    /* JADX WARN: Type inference failed for: r16v13 */
    /* JADX WARN: Type inference failed for: r16v3 */
    /* JADX WARN: Type inference failed for: r16v4 */
    /* JADX WARN: Type inference failed for: r16v5 */
    /* JADX WARN: Type inference failed for: r16v7 */
    /* JADX WARN: Type inference failed for: r16v8, types: [java.io.FileOutputStream] */
    /* JADX WARN: Type inference failed for: r16v9 */
    /* JADX WARN: Type inference failed for: r8v0 */
    /* JADX WARN: Type inference failed for: r8v1 */
    /* JADX WARN: Type inference failed for: r8v2 */
    /* JADX WARN: Type inference failed for: r8v3 */
    /* JADX WARN: Type inference failed for: r8v6 */
    /* JADX WARN: Type inference failed for: r8v8 */
    /* JADX WARN: Type inference failed for: r8v9 */
    public final void b(File file, File file2, long j6, String str, AtomicBoolean atomicBoolean, Function1 function1) throws Throwable {
        ?? r16;
        ?? r17;
        Throwable th;
        FileDescriptor fd;
        ?? r15;
        ?? r18;
        J3.l.f(file, "source");
        J3.l.f(str, "expected");
        J3.l.f(atomicBoolean, "cancelled");
        J3.l.f(function1, ReactProgressBarViewManager.PROP_PROGRESS);
        if (!file.isFile() || file.length() != j6) {
            throw new IllegalArgumentException("MODEL_SIZE_MISMATCH");
        }
        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        ?? fileOutputStream = file2 != null ? new FileOutputStream(file2) : 0;
        try {
            try {
                BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(file), 262144);
                try {
                    byte[] bArr = new byte[262144];
                    long j7 = 0;
                    long j8 = 0;
                    fileOutputStream = fileOutputStream;
                    while (!atomicBoolean.get()) {
                        try {
                            int i6 = bufferedInputStream.read(bArr);
                            if (i6 < 0) {
                                ?? r19 = fileOutputStream;
                                p137u3.A a6 = p137u3.A.f16167a;
                                F3.c.a(bufferedInputStream, null);
                                if (j7 != j6) {
                                    throw new IllegalStateException("MODEL_SIZE_MISMATCH");
                                }
                                byte[] bArrDigest = messageDigest.digest();
                                J3.l.e(bArrDigest, "digest(...)");
                                if (!J3.l.b(AbstractC0975j.Z(bArrDigest, "", null, null, 0, null, new B0(), 30, null), str)) {
                                    throw new IllegalStateException("MODEL_INTEGRITY_FAILED");
                                }
                                if (atomicBoolean.get()) {
                                    throw new IllegalStateException("CANCELLED");
                                }
                                if (r19 != 0 && (fd = r19.getFD()) != null) {
                                    fd.sync();
                                }
                                if (r19 != 0) {
                                    r19.close();
                                    return;
                                }
                                return;
                            }
                            r17 = fileOutputStream;
                            j7 += (long) i6;
                            if (j7 > j6) {
                                r15 = r17;
                                throw new IllegalStateException("MODEL_SIZE_MISMATCH");
                            }
                            try {
                                messageDigest.update(bArr, 0, i6);
                                if (r17 != 0) {
                                    r15 = r17;
                                    try {
                                        r15.write(bArr, 0, i6);
                                        r18 = r15;
                                    } catch (Throwable th2) {
                                        th = th2;
                                        r16 = r15;
                                    }
                                } else {
                                    r18 = r17;
                                }
                                long jNanoTime = System.nanoTime();
                                r17 = ((jNanoTime - j8) > 150000000L ? 1 : ((jNanoTime - j8) == 150000000L ? 0 : -1));
                                if (r17 > 0 || j7 == j6) {
                                    function1.q(Long.valueOf(j7));
                                    j8 = jNanoTime;
                                }
                                fileOutputStream = r18;
                            } catch (Throwable th3) {
                                th = th3;
                                th = th;
                                r16 = r17;
                                throw th;
                            }
                            th = th2;
                            r16 = r15;
                            try {
                                throw th;
                            } catch (Throwable th4) {
                                F3.c.a(bufferedInputStream, th);
                                throw th4;
                            }
                        } catch (Throwable th5) {
                            th = th5;
                        }
                    }
                    throw new IllegalStateException("CANCELLED");
                } catch (Throwable th6) {
                    th = th6;
                    r17 = fileOutputStream;
                }
            } catch (Throwable th7) {
                th = th7;
                if (r16 != 0) {
                    r16.close();
                }
                if (file2 != null) {
                    file2.delete();
                }
                throw th;
            }
        } catch (Throwable th8) {
            th = th8;
            r16 = fileOutputStream;
            if (r16 != 0) {
                r16.close();
            }
            if (file2 != null) {
                file2.delete();
            }
            throw th;
        }
    }
}
