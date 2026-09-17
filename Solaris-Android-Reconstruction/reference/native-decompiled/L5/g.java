package L5;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class g implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ long f1739f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ m f1740g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ boolean f1741h;

    public /* synthetic */ g(long j6, m mVar, boolean z6) {
        this.f1739f = j6;
        this.f1740g = mVar;
        this.f1741h = z6;
    }

    @Override // java.lang.Runnable
    public final void run() {
        m.o(this.f1739f, this.f1740g, this.f1741h);
    }
}
