package K5;

import android.content.Context;
import kotlin.jvm.internal.DefaultConstructorMarker;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class A0$a {
    public /* synthetic */ A0$a(DefaultConstructorMarker defaultConstructorMarker) {
        this();
    }

    public final boolean a(int i6) {
        return i6 == 1 || i6 == 2 || i6 == 4;
    }

    public final synchronized A0 b(Context context) {
        A0 a0B;
        J3.l.f(context, "context");
        a0B = A0.b();
        if (a0B == null) {
            Context applicationContext = context.getApplicationContext();
            J3.l.e(applicationContext, "getApplicationContext(...)");
            a0B = new A0(applicationContext, null);
            A0.c(a0B);
        }
        return a0B;
    }

    public final String c(int i6) {
        if (i6 == 1) {
            return "WAITING_TO_RETRY";
        }
        if (i6 == 2) {
            return "WAITING_FOR_NETWORK";
        }
        if (i6 == 3) {
            return "WAITING_FOR_WIFI";
        }
        if (i6 == 4) {
            return "WAITING";
        }
        if (i6 == 1006) {
            return "INSUFFICIENT_SPACE";
        }
        if (i6 == 1007) {
            return "STORAGE_UNAVAILABLE";
        }
        if (i6 == 1008) {
            return "DOWNLOAD_CANNOT_RESUME";
        }
        if (i6 == 1009) {
            return "FILE_ALREADY_EXISTS";
        }
        if (i6 == 1004) {
            return "HTTP_DATA_ERROR";
        }
        if (i6 == 1005) {
            return "TOO_MANY_REDIRECTS";
        }
        return (400 > i6 || i6 >= 600) ? "DOWNLOAD_FAILED" : "HTTP_ERROR";
    }

    private A0$a() {
    }
}
