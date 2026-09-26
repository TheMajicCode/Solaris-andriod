package K5;

import android.os.SystemClock;
import android.speech.SpeechRecognizer;

/* JADX INFO: renamed from: K5.t0$e, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class RunnableC0103t0$e implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ long f1681f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ C0098t0 f1682g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ long f1683h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    final /* synthetic */ SpeechRecognizer f1684i;

    /* JADX INFO: renamed from: j, reason: collision with root package name */
    final /* synthetic */ Integer f1685j;

    /* JADX INFO: renamed from: k, reason: collision with root package name */
    final /* synthetic */ J3.A f1686k;

    RunnableC0103t0$e(long j6, C0098t0 c0098t0, long j7, SpeechRecognizer speechRecognizer, Integer num, J3.A a6) {
        this.f1681f = j6;
        this.f1682g = c0098t0;
        this.f1683h = j7;
        this.f1684i = speechRecognizer;
        this.f1685j = num;
        this.f1686k = a6;
    }

    @Override // java.lang.Runnable
    public void run() {
        if (this.f1681f != C0098t0.k(this.f1682g)) {
            return;
        }
        if (SystemClock.elapsedRealtime() >= this.f1683h) {
            C0098t0.r(this.f1681f, this.f1682g, this.f1685j);
            return;
        }
        try {
            SpeechRecognizer speechRecognizer = this.f1684i;
            C0098t0 c0098t0 = this.f1682g;
            AbstractC0075h0.a(speechRecognizer, C0098t0.o(c0098t0, C0098t0.l(c0098t0)), C0098t0.j(this.f1682g).getMainExecutor(), AbstractC0073g0.a(new t0$e$a(this.f1681f, this.f1682g, this.f1686k)));
        } catch (Exception unused) {
            C0098t0.r(this.f1681f, this.f1682g, this.f1685j);
        }
    }
}
