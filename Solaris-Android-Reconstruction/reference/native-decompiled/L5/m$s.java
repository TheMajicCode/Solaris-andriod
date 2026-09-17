package L5;

import com.facebook.react.bridge.BaseJavaModule;
import kotlin.jvm.functions.Function2;
import org.json.JSONObject;
import p137u3.A;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class m$s implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1833f;

    public m$s(m mVar) {
        this.f1833f = mVar;
    }

    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<unused var>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        if (m.u(this.f1833f, sVar)) {
            if (m.L(this.f1833f).d() || m.N(this.f1833f) == null) {
                m.x(this.f1833f, "RESTORE_PREVIEW_ONLY");
                return;
            }
            m mVar = this.f1833f;
            JSONObject jSONObjectN = m.N(mVar);
            J3.l.c(jSONObjectN);
            m.s(mVar, true, "", jSONObjectN);
        }
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return A.f16167a;
    }
}
