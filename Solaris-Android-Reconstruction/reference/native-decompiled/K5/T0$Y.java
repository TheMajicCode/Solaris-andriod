package K5;

import com.facebook.react.bridge.BaseJavaModule;
import java.util.List;
import kotlin.jvm.functions.Function2;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class T0$Y implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1562f;

    public T0$Y(T0 t6) {
        this.f1562f = t6;
    }

    public final void b(Object[] objArr, W2.s sVar) {
        W2.s sVar2;
        J3.l.f(objArr, "<destruct>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        List list = (List) objArr[0];
        long jZ = T0.z(this.f1562f);
        try {
            List listC = C0071f0.f1640a.c(list);
            if (!J3.l.b(T0.x(this.f1562f).v().get("available"), Boolean.TRUE)) {
                sVar.i(T0.x(this.f1562f).v());
                p137u3.A a6 = p137u3.A.f16167a;
                return;
            }
            sVar2 = sVar;
            try {
                T0.A(this.f1562f).post(new RunnableC0039T0$f(jZ, this.f1562f, listC, sVar2));
            } catch (Exception unused) {
                sVar2.reject("HEALTH_SCOPE_INVALID", "HEALTH_SCOPE_INVALID", null);
                p137u3.A a7 = p137u3.A.f16167a;
            }
        } catch (Exception unused2) {
            sVar2 = sVar;
        }
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return p137u3.A.f16167a;
    }
}
