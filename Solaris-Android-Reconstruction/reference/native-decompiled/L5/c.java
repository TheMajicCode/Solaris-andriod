package L5;

import android.content.Context;
import android.net.Uri;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class c {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final c f1737a = new c();

    private c() {
    }

    public final byte[] a(Context context, Uri uri) throws IOException {
        J3.l.f(context, "context");
        J3.l.f(uri, "uri");
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        byte[] bArr = new byte[65536];
        InputStream inputStreamOpenInputStream = context.getContentResolver().openInputStream(uri);
        try {
            if (inputStreamOpenInputStream == null) {
                throw new IllegalArgumentException("RECOVERY_READ_FAILED");
            }
            while (true) {
                int i6 = inputStreamOpenInputStream.read(bArr);
                if (i6 < 0) {
                    A a6 = A.f16167a;
                    F3.c.a(inputStreamOpenInputStream, null);
                    byte[] byteArray = byteArrayOutputStream.toByteArray();
                    J3.l.e(byteArray, "toByteArray(...)");
                    return byteArray;
                }
                if (byteArrayOutputStream.size() + i6 > 16777288) {
                    throw new IllegalArgumentException("RECOVERY_SIZE");
                }
                byteArrayOutputStream.write(bArr, 0, i6);
            }
        } catch (Throwable th) {
            try {
                throw th;
            } catch (Throwable th2) {
                F3.c.a(inputStreamOpenInputStream, th);
                throw th2;
            }
        }
    }

    public final byte[] b(Context context, Uri uri, byte[] bArr) throws IOException {
        J3.l.f(context, "context");
        J3.l.f(uri, "uri");
        J3.l.f(bArr, "data");
        OutputStream outputStreamOpenOutputStream = context.getContentResolver().openOutputStream(uri, "wt");
        try {
            if (outputStreamOpenOutputStream == null) {
                throw new IllegalArgumentException("RECOVERY_WRITE_FAILED");
            }
            outputStreamOpenOutputStream.write(bArr);
            outputStreamOpenOutputStream.flush();
            A a6 = A.f16167a;
            F3.c.a(outputStreamOpenOutputStream, null);
            return a(context, uri);
        } catch (Throwable th) {
            try {
                throw th;
            } catch (Throwable th2) {
                F3.c.a(outputStreamOpenOutputStream, th);
                throw th2;
            }
        }
    }
}
