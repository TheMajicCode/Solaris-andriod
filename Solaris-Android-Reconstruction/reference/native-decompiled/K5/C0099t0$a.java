package K5;

import android.speech.ModelDownloadListener;
import android.speech.SpeechRecognizer;

/* JADX INFO: renamed from: K5.t0$a, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0099t0$a implements ModelDownloadListener {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    final /* synthetic */ long f1667a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    final /* synthetic */ C0098t0 f1668b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    final /* synthetic */ SpeechRecognizer f1669c;

    C0099t0$a(long j6, C0098t0 c0098t0, SpeechRecognizer speechRecognizer) {
        this.f1667a = j6;
        this.f1668b = c0098t0;
        this.f1669c = speechRecognizer;
    }

    public void onError(int i6) {
        if (this.f1667a != C0098t0.k(this.f1668b)) {
            return;
        }
        if (i6 == 15) {
            C0098t0.q(this.f1668b, this.f1669c, this.f1667a, Integer.valueOf(i6));
        } else {
            C0098t0.p(this.f1668b);
            C0098t0.F(this.f1668b, i6 == 9 ? "permission-denied" : "error", y0.f1692a.a(i6), null, null, Integer.valueOf(i6), 12, null);
        }
    }

    public void onProgress(int i6) {
        if (this.f1667a == C0098t0.k(this.f1668b)) {
            C0098t0.F(this.f1668b, "downloading", "SYSTEM_MANAGED_SIZE_UNKNOWN", null, Integer.valueOf(P3.g.i(i6, 0, 100)), null, 20, null);
        }
    }

    public void onScheduled() {
        if (this.f1667a == C0098t0.k(this.f1668b)) {
            C0098t0.p(this.f1668b);
            C0098t0.F(this.f1668b, "unavailable", "RESOURCE_DOWNLOAD_SCHEDULED", null, null, null, 28, null);
        }
    }

    public void onSuccess() {
        if (this.f1667a == C0098t0.k(this.f1668b)) {
            C0098t0.p(this.f1668b);
            C0098t0.F(this.f1668b, "ready", "RESOURCE_INSTALLED_RECHECK_BEFORE_USE", null, null, null, 28, null);
        }
    }
}
