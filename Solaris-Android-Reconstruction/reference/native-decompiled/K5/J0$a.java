package K5;

import android.content.Context;
import kotlin.jvm.internal.DefaultConstructorMarker;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class J0$a {
    public /* synthetic */ J0$a(DefaultConstructorMarker defaultConstructorMarker) {
        this();
    }

    public final synchronized J0 a(Context context) {
        J0 j0A;
        J3.l.f(context, "context");
        j0A = J0.a();
        if (j0A == null) {
            Context applicationContext = context.getApplicationContext();
            J3.l.e(applicationContext, "getApplicationContext(...)");
            j0A = new J0(applicationContext, null);
            J0.b(j0A);
        }
        return j0A;
    }

    public final boolean b(boolean z6, boolean z7, Integer num) {
        if (!z7) {
            return false;
        }
        if (z6) {
            return true;
        }
        if (num != null && num.intValue() == 4) {
            return true;
        }
        if (num != null && num.intValue() == 5) {
            return true;
        }
        return num != null && num.intValue() == 6;
    }

    public final String c(Integer num) {
        if (num != null && num.intValue() == 3) {
            return "LOW_MEMORY";
        }
        if (num != null && num.intValue() == 4) {
            return "JAVA_CRASH";
        }
        if (num != null && num.intValue() == 5) {
            return "NATIVE_CRASH";
        }
        if (num != null && num.intValue() == 6) {
            return "ANR";
        }
        if (num != null && num.intValue() == 10) {
            return "USER_REQUESTED";
        }
        return num == null ? "UNKNOWN" : "OTHER_EXIT";
    }

    private J0$a() {
    }
}
