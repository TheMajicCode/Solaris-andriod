package K5;

/* JADX INFO: renamed from: K5.p0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class RunnableC0091p0 implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ long f1646f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ C0098t0 f1647g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ Integer f1648h;

    public /* synthetic */ RunnableC0091p0(long j6, C0098t0 c0098t0, Integer num) {
        this.f1646f = j6;
        this.f1647g = c0098t0;
        this.f1648h = num;
    }

    @Override // java.lang.Runnable
    public final void run() {
        C0098t0.e(this.f1646f, this.f1647g, this.f1648h);
    }
}
