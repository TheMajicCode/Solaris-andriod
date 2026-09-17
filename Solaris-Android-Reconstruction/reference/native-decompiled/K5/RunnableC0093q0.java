package K5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: renamed from: K5.q0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class RunnableC0093q0 implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ long f1649f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ C0098t0 f1650g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ Function1 f1651h;

    public /* synthetic */ RunnableC0093q0(long j6, C0098t0 c0098t0, Function1 function1) {
        this.f1649f = j6;
        this.f1650g = c0098t0;
        this.f1651h = function1;
    }

    @Override // java.lang.Runnable
    public final void run() {
        C0098t0.b(this.f1649f, this.f1650g, this.f1651h);
    }
}
