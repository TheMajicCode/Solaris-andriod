package K5;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import p143v3.AbstractC0982q;

/* JADX INFO: renamed from: K5.f0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0071f0 {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final C0071f0 f1640a = new C0071f0();

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private static final LinkedHashMap f1641b = p143v3.L.k(p137u3.s.a("steps", "android.permission.health.READ_STEPS"), p137u3.s.a("sleep", "android.permission.health.READ_SLEEP"));

    private C0071f0() {
    }

    public final List a(String str, String str2, String str3) {
        J3.l.f(str, "start");
        J3.l.f(str2, "end");
        J3.l.f(str3, "zone");
        if (!new p027d5.o("\\d{4}-\\d{2}-\\d{2}").e(str) || !new p027d5.o("\\d{4}-\\d{2}-\\d{2}").e(str2)) {
            throw new IllegalArgumentException("HEALTH_RANGE_INVALID");
        }
        ZoneId.of(str3);
        LocalDate localDate = LocalDate.parse(str);
        long jBetween = ChronoUnit.DAYS.between(localDate, LocalDate.parse(str2)) + 1;
        if (1 > jBetween || jBetween >= 31) {
            throw new IllegalArgumentException("HEALTH_RANGE_INVALID");
        }
        P3.f fVarN = P3.g.n(0, jBetween);
        ArrayList arrayList = new ArrayList(AbstractC0982q.u(fVarN, 10));
        Iterator it = fVarN.iterator();
        while (it.hasNext()) {
            arrayList.add(localDate.plusDays(((p143v3.K) it).nextLong()));
        }
        return arrayList;
    }

    public final LinkedHashMap b() {
        return f1641b;
    }

    public final List c(List list) {
        J3.l.f(list, "values");
        if (!list.isEmpty() && list.size() <= 2 && AbstractC0982q.U(list).size() == list.size()) {
            if (!list.isEmpty()) {
                Iterator it = list.iterator();
                while (it.hasNext()) {
                    if (f1641b.containsKey((String) it.next())) {
                    }
                }
            }
            return list;
        }
        throw new IllegalArgumentException("HEALTH_SCOPE_INVALID");
    }
}
