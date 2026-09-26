package K5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class P0 implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ T0 f1511f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ W2.s f1512g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ Function1 f1513h;

    public /* synthetic */ P0(T0 t6, W2.s sVar, Function1 function1) {
        this.f1511f = t6;
        this.f1512g = sVar;
        this.f1513h = function1;
    }

    @Override // java.lang.Runnable
    public final void run() {
        T0.n(this.f1511f, this.f1512g, this.f1513h);
    }
}
