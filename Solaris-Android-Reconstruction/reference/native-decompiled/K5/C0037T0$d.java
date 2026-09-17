package K5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: renamed from: K5.T0$d, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class C0037T0$d implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1573f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ String f1574g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ String f1575h;

    C0037T0$d(T0 t6, String str, String str2) {
        this.f1573f = t6;
        this.f1574g = str;
        this.f1575h = str2;
    }

    public final void b(Function1 function1) {
        J3.l.f(function1, "done");
        T0.E(this.f1573f).T(this.f1574g, this.f1575h, function1);
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        b((Function1) obj);
        return p137u3.A.f16167a;
    }
}
