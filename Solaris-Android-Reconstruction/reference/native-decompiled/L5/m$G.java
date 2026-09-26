package L5;

import kotlin.jvm.functions.Function1;
import p143v3.L;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$G implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1781f;

    public m$G(m mVar) {
        this.f1781f = mVar;
    }

    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "it");
        return L.l(p137u3.s.a("exists", Boolean.valueOf(m.L(this.f1781f).d())), p137u3.s.a("ceremony", Boolean.valueOf(m.M(this.f1781f) != null)));
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
