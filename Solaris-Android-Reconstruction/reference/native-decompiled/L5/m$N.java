package L5;

import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$N implements I3.a {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1786f;

    public m$N(m mVar) {
        this.f1786f = mVar;
    }

    public final void b() {
        m.v(this.f1786f);
        synchronized (m.L(this.f1786f)) {
            m.L(this.f1786f).h();
            A a6 = A.f16167a;
        }
        m.W(this.f1786f, null);
        m.H(this.f1786f).shutdown();
    }

    @Override // I3.a
    public /* bridge */ /* synthetic */ Object invoke() {
        b();
        return A.f16167a;
    }
}
