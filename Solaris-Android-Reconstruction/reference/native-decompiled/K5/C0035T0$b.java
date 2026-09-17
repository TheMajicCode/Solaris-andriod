package K5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: renamed from: K5.T0$b, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class C0035T0$b implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1565f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ String f1566g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ String f1567h;

    C0035T0$b(T0 t6, String str, String str2) {
        this.f1565f = t6;
        this.f1566g = str;
        this.f1567h = str2;
    }

    public final void b(Function1 function1) {
        J3.l.f(function1, "done");
        T0.E(this.f1565f).U(this.f1566g, this.f1567h, function1);
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        b((Function1) obj);
        return p137u3.A.f16167a;
    }
}
