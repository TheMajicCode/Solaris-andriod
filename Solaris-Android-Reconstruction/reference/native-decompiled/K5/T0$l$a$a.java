package K5;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map$Entry;
import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class T0$l$a$a implements Function1 {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ T0 f1605f;

    T0$l$a$a(T0 t6) {
        this.f1605f = t6;
    }

    public final void b(Map map) {
        J3.l.f(map, "data");
        T0 t6 = this.f1605f;
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        for (Map$Entry map$Entry : map.entrySet()) {
            if (!J3.l.b((String) map$Entry.getKey(), "path")) {
                linkedHashMap.put(map$Entry.getKey(), map$Entry.getValue());
            }
        }
        t6.i("modelProgress", linkedHashMap);
    }

    @Override // kotlin.jvm.functions.Function1
    public /* bridge */ /* synthetic */ Object q(Object obj) {
        b((Map) obj);
        return p137u3.A.f16167a;
    }
}
