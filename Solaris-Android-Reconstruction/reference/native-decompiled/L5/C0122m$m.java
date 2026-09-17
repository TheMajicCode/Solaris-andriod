package L5;

import android.app.Activity;
import com.facebook.react.bridge.BaseJavaModule;
import kotlin.jvm.functions.Function2;
import p137u3.A;

/* JADX INFO: renamed from: L5.m$m, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0122m$m implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1827f;

    public C0122m$m(m mVar) {
        this.f1827f = mVar;
    }

    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<unused var>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        if (m.u(this.f1827f, sVar)) {
            try {
                synchronized (m.L(this.f1827f)) {
                    m.L(this.f1827f).i("solaris-attachment-unlock-check/1");
                }
                Activity activityA = this.f1827f.a().a();
                if (activityA == null) {
                    throw new IllegalStateException("VAULT_UNAVAILABLE");
                }
                p$a p_a = new p$a();
                m.P(this.f1827f, p_a);
                m mVar = this.f1827f;
                m.R(mVar, (m.B(mVar) + 1) % 9000);
                m mVar2 = this.f1827f;
                m.Q(mVar2, m.B(mVar2) + 10000);
                activityA.runOnUiThread(new RunnableC0112m$c(this.f1827f, p_a, activityA, m.A(this.f1827f)));
            } catch (Exception unused) {
                m.x(this.f1827f, "ATTACHMENT_UNAVAILABLE");
            }
        }
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return A.f16167a;
    }
}
