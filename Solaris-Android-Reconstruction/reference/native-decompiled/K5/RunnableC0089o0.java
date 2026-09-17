package K5;

/* JADX INFO: renamed from: K5.o0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class RunnableC0089o0 implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ long f1644f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ C0098t0 f1645g;

    public /* synthetic */ RunnableC0089o0(long j6, C0098t0 c0098t0) {
        this.f1644f = j6;
        this.f1645g = c0098t0;
    }

    @Override // java.lang.Runnable
    public final void run() {
        C0098t0.c(this.f1644f, this.f1645g);
    }
}
