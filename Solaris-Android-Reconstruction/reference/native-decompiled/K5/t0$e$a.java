package K5;

import android.os.Handler;
import android.speech.RecognitionSupport;
import android.speech.RecognitionSupportCallback;
import java.util.List;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class t0$e$a implements RecognitionSupportCallback {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    final /* synthetic */ long f1687a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    final /* synthetic */ C0098t0 f1688b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    final /* synthetic */ J3.A f1689c;

    t0$e$a(long j6, C0098t0 c0098t0, J3.A a6) {
        this.f1687a = j6;
        this.f1688b = c0098t0;
        this.f1689c = a6;
    }

    public void onError(int i6) {
        if (this.f1687a != C0098t0.k(this.f1688b)) {
            return;
        }
        C0098t0.p(this.f1688b);
        C0098t0.F(this.f1688b, "unavailable", y0.f1692a.a(i6), null, null, Integer.valueOf(i6), 12, null);
    }

    public void onSupportResult(RecognitionSupport recognitionSupport) {
        Runnable runnable;
        J3.l.f(recognitionSupport, "support");
        if (this.f1687a != C0098t0.k(this.f1688b)) {
            return;
        }
        y0 y0Var = y0.f1692a;
        String strL = C0098t0.l(this.f1688b);
        List listA = u0.a(recognitionSupport);
        J3.l.e(listA, "getInstalledOnDeviceLanguages(...)");
        String strB = y0Var.b(strL, listA);
        if (strB != null) {
            C0098t0.t(this.f1688b, strB);
            C0098t0.p(this.f1688b);
            C0098t0.F(this.f1688b, "ready", "RESOURCE_INSTALLED_RECHECK_BEFORE_USE", null, null, null, 28, null);
            return;
        }
        Handler handlerM = C0098t0.m(this.f1688b);
        Object obj = this.f1689c.f1200f;
        if (obj == null) {
            J3.l.t("poll");
            runnable = null;
        } else {
            runnable = (Runnable) obj;
        }
        handlerM.postDelayed(runnable, 2000L);
    }
}
