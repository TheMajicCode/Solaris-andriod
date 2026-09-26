package K5;

import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class z0 implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ A0 f1696f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ Function1 f1697g;

    public /* synthetic */ z0(A0 a6, Function1 function1) {
        this.f1696f = a6;
        this.f1697g = function1;
    }

    @Override // kotlin.jvm.functions.Function1
    public final Object q(Object obj) {
        return A0.a(this.f1696f, this.f1697g, ((Long) obj).longValue());
    }
}
