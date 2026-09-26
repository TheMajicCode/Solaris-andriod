package L5;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class j implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ long f1750f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ m f1751g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ Object f1752h;

    public /* synthetic */ j(long j6, m mVar, Object obj) {
        this.f1750f = j6;
        this.f1751g = mVar;
        this.f1752h = obj;
    }

    @Override // java.lang.Runnable
    public final void run() {
        m.p(this.f1750f, this.f1751g, this.f1752h);
    }
}
