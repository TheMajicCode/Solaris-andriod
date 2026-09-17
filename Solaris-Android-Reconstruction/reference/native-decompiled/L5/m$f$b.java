package L5;

import p143v3.AbstractC0982q;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class m$f$b implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1813f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ p$a f1814g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ Exception f1815h;

    m$f$b(m mVar, p$a p_a, Exception exc) {
        this.f1813f = mVar;
        this.f1814g = p_a;
        this.f1815h = exc;
    }

    @Override // java.lang.Runnable
    public final void run() {
        if (m.z(this.f1813f) == this.f1814g) {
            String message = this.f1815h.getMessage();
            String str = "ATTACHMENT_READ";
            if (message != null) {
                if (!AbstractC0982q.m("CANCELLED", "ATTACHMENT_SIZE", "ATTACHMENT_TYPE", "ATTACHMENT_READ", "ATTACHMENT_URI").contains(message)) {
                    message = null;
                }
                if (message != null) {
                    str = message;
                }
            }
            m.x(this.f1813f, str);
        }
    }
}
