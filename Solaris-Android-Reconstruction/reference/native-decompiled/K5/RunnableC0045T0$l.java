package K5;

/* JADX INFO: renamed from: K5.T0$l, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class RunnableC0045T0$l implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1602f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ W2.s f1603g;

    RunnableC0045T0$l(T0 t6, W2.s sVar) {
        this.f1602f = t6;
        this.f1603g = sVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        T0 t6 = this.f1602f;
        T0.F(t6, this.f1603g, new T0$l$a(t6));
    }
}
