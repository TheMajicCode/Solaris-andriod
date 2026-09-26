package K5;

import java.util.Map;
import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class Q0 implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ T0 f1514f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ W2.s f1515g;

    public /* synthetic */ Q0(T0 t6, W2.s sVar) {
        this.f1514f = t6;
        this.f1515g = sVar;
    }

    @Override // kotlin.jvm.functions.Function1
    public final Object q(Object obj) {
        return T0.l(this.f1514f, this.f1515g, (Map) obj);
    }
}
