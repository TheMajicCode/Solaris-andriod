package K5;

import com.facebook.react.bridge.BaseJavaModule;
import java.util.concurrent.ExecutorService;
import kotlin.jvm.functions.Function2;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class T0$c0 implements Function2 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1572f;

    public T0$c0(T0 t6) {
        this.f1572f = t6;
    }

    public final void b(Object[] objArr, W2.s sVar) {
        J3.l.f(objArr, "<destruct>");
        J3.l.f(sVar, BaseJavaModule.METHOD_TYPE_PROMISE);
        Object obj = objArr[0];
        Object obj2 = objArr[1];
        String str = (String) objArr[2];
        long jW = T0.x(this.f1572f).w();
        ExecutorService executorServiceY = T0.y(this.f1572f);
        T0 t6 = this.f1572f;
        executorServiceY.execute(new RunnableC0040T0$g(sVar, t6, (String) obj, (String) obj2, str, jW));
    }

    @Override // kotlin.jvm.functions.Function2
    public /* bridge */ /* synthetic */ Object w(Object obj, Object obj2) {
        b((Object[]) obj, (W2.s) obj2);
        return p137u3.A.f16167a;
    }
}
