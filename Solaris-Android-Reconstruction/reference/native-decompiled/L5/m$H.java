package L5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$H implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1782f;

    public m$H(m mVar) {
        this.f1782f = mVar;
    }

    public final Object b(Object[] objArr) throws Exception {
        J3.l.f(objArr, "it");
        m.L(this.f1782f).k();
        return Boolean.TRUE;
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        return b((Object[]) obj);
    }
}
