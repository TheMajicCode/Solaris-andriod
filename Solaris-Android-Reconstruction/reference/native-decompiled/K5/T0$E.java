package K5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class T0$E implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1542f;

    public T0$E(T0 t6) {
        this.f1542f = t6;
    }

    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "<destruct>");
        W2.s sVar = (W2.s) objArr[0];
        T0.v(this.f1542f);
        sVar.d(true);
        return p137u3.A.f16167a;
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
