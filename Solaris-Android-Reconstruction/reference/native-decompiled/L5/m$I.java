package L5;

import kotlin.jvm.functions.Function1;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$I implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1783f;

    public m$I(m mVar) {
        this.f1783f = mVar;
    }

    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "it");
        if (m.D(this.f1783f) || m.z(this.f1783f) != null) {
            m.x(this.f1783f, "CANCELLED");
        }
        synchronized (m.L(this.f1783f)) {
            m.L(this.f1783f).h();
            A a6 = A.f16167a;
        }
        m.W(this.f1783f, null);
        return Boolean.TRUE;
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
