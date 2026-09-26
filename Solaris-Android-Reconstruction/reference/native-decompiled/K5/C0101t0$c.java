package K5;

import android.speech.RecognitionSupport;
import android.speech.RecognitionSupportCallback;
import android.speech.SpeechRecognizer;
import java.util.List;
import kotlin.jvm.functions.Function1;

/* JADX INFO: renamed from: K5.t0$c, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0101t0$c implements RecognitionSupportCallback {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    final /* synthetic */ long f1672a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    final /* synthetic */ C0098t0 f1673b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    final /* synthetic */ Runnable f1674c;

    /* JADX INFO: renamed from: d, reason: collision with root package name */
    final /* synthetic */ String f1675d;

    /* JADX INFO: renamed from: e, reason: collision with root package name */
    final /* synthetic */ String f1676e;

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ SpeechRecognizer f1677f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ Function1 f1678g;

    C0101t0$c(long j6, C0098t0 c0098t0, Runnable runnable, String str, String str2, SpeechRecognizer speechRecognizer, Function1 function1) {
        this.f1672a = j6;
        this.f1673b = c0098t0;
        this.f1674c = runnable;
        this.f1675d = str;
        this.f1676e = str2;
        this.f1677f = speechRecognizer;
        this.f1678g = function1;
    }

    public void onError(int i6) {
        if (this.f1672a == C0098t0.k(this.f1673b)) {
            C0098t0.p(this.f1673b);
            this.f1678g.q(C0098t0.F(this.f1673b, i6 == 9 ? "permission-denied" : "unavailable", i6 == 14 ? "LANGUAGE_CHECK_UNAVAILABLE" : y0.f1692a.a(i6), null, null, Integer.valueOf(i6), 12, null));
        }
    }

    public void onSupportResult(RecognitionSupport recognitionSupport) {
        J3.l.f(recognitionSupport, "support");
        if (this.f1672a != C0098t0.k(this.f1673b)) {
            return;
        }
        C0098t0.m(this.f1673b).removeCallbacks(this.f1674c);
        y0 y0Var = y0.f1692a;
        String str = this.f1675d;
        List listA = u0.a(recognitionSupport);
        J3.l.e(listA, "getInstalledOnDeviceLanguages(...)");
        List listA2 = v0.a(recognitionSupport);
        J3.l.e(listA2, "getPendingOnDeviceLanguages(...)");
        List listA3 = w0.a(recognitionSupport);
        J3.l.e(listA3, "getSupportedOnDeviceLanguages(...)");
        y0$a y0_aD = y0Var.d(str, listA, listA2, listA3);
        C0098t0.t(this.f1673b, y0_aD.a());
        String strC = y0_aD.c();
        if (J3.l.b(strC, "ready")) {
            if (J3.l.b(this.f1676e, "start")) {
                C0098t0.h(this.f1673b, this.f1677f, this.f1672a, this.f1678g);
                return;
            } else {
                C0098t0.p(this.f1673b);
                this.f1678g.q(C0098t0.F(this.f1673b, "ready", null, null, null, null, 30, null));
                return;
            }
        }
        if (!J3.l.b(strC, "required")) {
            C0098t0.p(this.f1673b);
            this.f1678g.q(C0098t0.F(this.f1673b, "unavailable", y0_aD.b(), null, null, null, 28, null));
        } else if (J3.l.b(this.f1676e, "download")) {
            C0098t0.g(this.f1673b, this.f1677f, this.f1672a, this.f1678g);
        } else {
            C0098t0.p(this.f1673b);
            this.f1678g.q(C0098t0.F(this.f1673b, "unavailable", y0_aD.b(), null, null, null, 28, null));
        }
    }
}
