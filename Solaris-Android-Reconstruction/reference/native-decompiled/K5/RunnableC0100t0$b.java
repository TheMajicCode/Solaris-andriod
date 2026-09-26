package K5;

/* JADX INFO: renamed from: K5.t0$b, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class RunnableC0100t0$b implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ long f1670f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ C0098t0 f1671g;

    RunnableC0100t0$b(long j6, C0098t0 c0098t0) {
        this.f1670f = j6;
        this.f1671g = c0098t0;
    }

    @Override // java.lang.Runnable
    public void run() {
        if (this.f1670f == C0098t0.k(this.f1671g) && J3.l.b(C0098t0.n(this.f1671g), "recording")) {
            C0098t0.F(this.f1671g, "recording", null, null, null, null, 30, null);
            C0098t0.m(this.f1671g).postDelayed(this, 1000L);
        }
    }
}
