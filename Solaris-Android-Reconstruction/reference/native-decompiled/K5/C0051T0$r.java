package K5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: renamed from: K5.T0$r, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0051T0$r implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1615f;

    public C0051T0$r(T0 t6) {
        this.f1615f = t6;
    }

    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "<destruct>");
        T0.w(this.f1615f).execute(new RunnableC0045T0$l(this.f1615f, (W2.s) objArr[0]));
        return p137u3.A.f16167a;
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
