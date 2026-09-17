package L5;

import java.util.Map;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class m$f$a implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1810f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ p$a f1811g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ Map f1812h;

    m$f$a(m mVar, p$a p_a, Map map) {
        this.f1810f = mVar;
        this.f1811g = p_a;
        this.f1812h = map;
    }

    @Override // java.lang.Runnable
    public final void run() {
        p$a p_aZ = m.z(this.f1810f);
        p$a p_a = this.f1811g;
        if (p_aZ == p_a) {
            try {
                p_a.c();
                m.y(this.f1810f, this.f1812h);
            } catch (Exception unused) {
                if (m.z(this.f1810f) == this.f1811g) {
                    m.x(this.f1810f, "CANCELLED");
                }
            }
        }
    }
}
