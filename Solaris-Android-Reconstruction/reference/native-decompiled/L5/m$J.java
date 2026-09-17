package L5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$J implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1784f;

    public m$J(m mVar) {
        this.f1784f = mVar;
    }

    public final Object b(Object[] objArr) {
        J3.l.f(objArr, "it");
        if (m.z(this.f1784f) != null) {
            m.x(this.f1784f, "CANCELLED");
        }
        return Boolean.TRUE;
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
