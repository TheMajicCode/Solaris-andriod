package K5;

import android.app.ActivityManager;
import java.util.List;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public abstract /* synthetic */ class D0 {
    public static /* bridge */ /* synthetic */ List a(ActivityManager activityManager, String str, int i6, int i7) {
        return activityManager.getHistoricalProcessExitReasons(str, i6, i7);
    }
}
