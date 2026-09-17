package K5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: renamed from: K5.T0$e, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class C0038T0$e implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1577f;

    C0038T0$e(T0 t6) {
        this.f1577f = t6;
    }

    public final void b(Function1 function1) {
        J3.l.f(function1, "done");
        function1.q(T0.E(this.f1577f).V());
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        b((Function1) obj);
        return p137u3.A.f16167a;
    }
}
