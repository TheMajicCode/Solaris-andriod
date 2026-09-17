package K5;

import android.content.Context;
import android.health.connect.AggregateRecordsRequest;
import android.health.connect.AggregateRecordsResponse;
import android.health.connect.HealthConnectException;
import android.health.connect.HealthConnectManager;
import android.health.connect.ReadRecordsRequestUsingFilters$Builder;
import android.health.connect.ReadRecordsResponse;
import android.health.connect.TimeInstantRangeFilter;
import android.health.connect.datatypes.AggregationType;
import android.health.connect.datatypes.IntervalRecord;
import android.health.connect.datatypes.Metadata;
import android.os.Build$VERSION;
import android.os.OutcomeReceiver;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Map$Entry;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import kotlin.Pair;
import kotlin.jvm.functions.Function1;
import org.json.JSONArray;
import p027d5.C0681d;
import p143v3.AbstractC0975j;
import p143v3.AbstractC0982q;

/* JADX INFO: renamed from: K5.e0, reason: case insensitive filesystem */
/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class C0069e0 {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    private final Context f1634a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    private volatile long f1635b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private long f1636c;

    public C0069e0(Context context) {
        J3.l.f(context, "context");
        this.f1634a = context;
        this.f1636c = Long.MAX_VALUE;
    }

    public static /* synthetic */ p137u3.A a(HealthConnectManager healthConnectManager, ReadRecordsRequestUsingFilters$Builder readRecordsRequestUsingFilters$Builder, C0069e0 c0069e0, OutcomeReceiver outcomeReceiver) {
        return u(healthConnectManager, readRecordsRequestUsingFilters$Builder, c0069e0, outcomeReceiver);
    }

    public static /* synthetic */ Comparable b(Map map) {
        return o(map);
    }

    public static /* synthetic */ Comparable c(Map map) {
        return q(map);
    }

    public static /* synthetic */ Comparable d(Map map) {
        return p(map);
    }

    public static /* synthetic */ p137u3.A e(HealthConnectManager healthConnectManager, AggregateRecordsRequest aggregateRecordsRequest, C0069e0 c0069e0, OutcomeReceiver outcomeReceiver) {
        return n(healthConnectManager, aggregateRecordsRequest, c0069e0, outcomeReceiver);
    }

    public static /* synthetic */ CharSequence f(byte b6) {
        return r(b6);
    }

    public static /* synthetic */ p137u3.A g(HealthConnectManager healthConnectManager, AggregateRecordsRequest aggregateRecordsRequest, C0069e0 c0069e0, OutcomeReceiver outcomeReceiver) {
        return m(healthConnectManager, aggregateRecordsRequest, c0069e0, outcomeReceiver);
    }

    private final Object h(long j6, String str, Function1 function1) {
        j(j6, str);
        CountDownLatch countDownLatch = new CountDownLatch(1);
        J3.A a6 = new J3.A();
        J3.A a7 = new J3.A();
        function1.q(new e0$a(a6, countDownLatch, a7));
        long jNanoTime = System.nanoTime() + TimeUnit.SECONDS.toNanos(20L);
        while (!countDownLatch.await(100L, TimeUnit.MILLISECONDS)) {
            j(j6, str);
            if (System.nanoTime() >= jNanoTime) {
                throw new IllegalStateException("HEALTH_READ_TIMEOUT");
            }
        }
        j(j6, str);
        HealthConnectException healthConnectExceptionA = r.a(a7.f1200f);
        if (healthConnectExceptionA != null) {
            throw new IllegalStateException((AbstractC0095s.a(healthConnectExceptionA) == 5 ? "HEALTH_PERMISSION_REVOKED" : "HEALTH_PROVIDER_READ_FAILED").toString());
        }
        Object obj = a6.f1200f;
        if (obj != null) {
            return obj;
        }
        throw new IllegalStateException("HEALTH_PROVIDER_READ_FAILED");
    }

    private final void j(long j6, String str) {
        if (j6 != this.f1635b) {
            throw new IllegalStateException("CANCELLED");
        }
        if (System.nanoTime() >= this.f1636c) {
            throw new IllegalStateException("HEALTH_READ_TIMEOUT");
        }
        if (str != null && !k().contains(str)) {
            throw new IllegalStateException("HEALTH_PERMISSION_REVOKED");
        }
    }

    private static final p137u3.A m(HealthConnectManager healthConnectManager, AggregateRecordsRequest aggregateRecordsRequest, C0069e0 c0069e0, OutcomeReceiver outcomeReceiver) {
        J3.l.f(outcomeReceiver, "it");
        AbstractC0097t.a(healthConnectManager, aggregateRecordsRequest, c0069e0.f1634a.getMainExecutor(), outcomeReceiver);
        return p137u3.A.f16167a;
    }

    private static final p137u3.A n(HealthConnectManager healthConnectManager, AggregateRecordsRequest aggregateRecordsRequest, C0069e0 c0069e0, OutcomeReceiver outcomeReceiver) {
        J3.l.f(outcomeReceiver, "it");
        AbstractC0097t.a(healthConnectManager, aggregateRecordsRequest, c0069e0.f1634a.getMainExecutor(), outcomeReceiver);
        return p137u3.A.f16167a;
    }

    private static final Comparable o(Map map) {
        J3.l.f(map, "it");
        return String.valueOf(map.get("kind"));
    }

    private static final Comparable p(Map map) {
        J3.l.f(map, "it");
        return String.valueOf(map.get("origin"));
    }

    private static final Comparable q(Map map) {
        J3.l.f(map, "it");
        return String.valueOf(map.get("id"));
    }

    private static final CharSequence r(byte b6) {
        String str = String.format("%02x", Arrays.copyOf(new Object[]{Byte.valueOf(b6)}, 1));
        J3.l.e(str, "format(...)");
        return str;
    }

    private final Map s(IntervalRecord intervalRecord, String str) {
        Metadata metadataA = AbstractC0104u.a(intervalRecord);
        J3.l.e(metadataA, "getMetadata(...)");
        return p143v3.L.k(p137u3.s.a("id", A.a(metadataA)), p137u3.s.a("kind", str), p137u3.s.a("origin", AbstractC0080k.a(B.a(metadataA))), p137u3.s.a("providerVersion", String.valueOf(C.a(metadataA))), p137u3.s.a("modifiedAt", D.a(metadataA).toString()), p137u3.s.a("startAt", AbstractC0108y.a(intervalRecord).toString()), p137u3.s.a("endAt", AbstractC0109z.a(intervalRecord).toString()), p137u3.s.a("startOffsetSeconds", Integer.valueOf(E.a(intervalRecord).getTotalSeconds())), p137u3.s.a("endOffsetSeconds", Integer.valueOf(F.a(intervalRecord).getTotalSeconds())), p137u3.s.a("value", Double.valueOf(AbstractC0105v.a(intervalRecord) ? AbstractC0106w.a(AbstractC0088o.a(intervalRecord)) : Duration.between(AbstractC0108y.a(intervalRecord), AbstractC0109z.a(intervalRecord)).toMillis() / 60000.0d)), p137u3.s.a("unit", J3.l.b(str, "steps") ? "steps" : "minutes"));
    }

    private final List t(HealthConnectManager healthConnectManager, Class cls, TimeInstantRangeFilter timeInstantRangeFilter, String str, long j6) {
        ArrayList arrayList = new ArrayList();
        LinkedHashSet linkedHashSet = new LinkedHashSet();
        long jA = -1;
        do {
            j(j6, str);
            ReadRecordsRequestUsingFilters$Builder readRecordsRequestUsingFilters$BuilderA = H.a(G.a(AbstractC0062b.a(cls), AbstractC0064c.a(timeInstantRangeFilter)), 500);
            J3.l.e(readRecordsRequestUsingFilters$BuilderA, "setPageSize(...)");
            if (jA != -1) {
                if (!linkedHashSet.add(Long.valueOf(jA))) {
                    throw new IllegalStateException("HEALTH_PAGINATION_FAILED");
                }
                J.a(readRecordsRequestUsingFilters$BuilderA, jA);
            }
            ReadRecordsResponse readRecordsResponseA = K.a(h(j6, str, new C0067d0(healthConnectManager, readRecordsRequestUsingFilters$BuilderA, this)));
            List listA = L.a(readRecordsResponseA);
            J3.l.e(listA, "getRecords(...)");
            arrayList.addAll(listA);
            if (arrayList.size() > 10000) {
                throw new IllegalStateException("HEALTH_RANGE_TOO_DENSE");
            }
            jA = M.a(readRecordsResponseA);
        } while (jA != -1);
        return arrayList;
    }

    private static final p137u3.A u(HealthConnectManager healthConnectManager, ReadRecordsRequestUsingFilters$Builder readRecordsRequestUsingFilters$Builder, C0069e0 c0069e0, OutcomeReceiver outcomeReceiver) {
        J3.l.f(outcomeReceiver, "it");
        P.a(healthConnectManager, O.a(N.a(readRecordsRequestUsingFilters$Builder)), c0069e0.f1634a.getMainExecutor(), outcomeReceiver);
        return p137u3.A.f16167a;
    }

    public final void i() {
        this.f1635b++;
    }

    public final List k() {
        LinkedHashMap linkedHashMapB = C0071f0.f1640a.b();
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        for (Map$Entry map$Entry : linkedHashMapB.entrySet()) {
            if (this.f1634a.checkSelfPermission((String) map$Entry.getValue()) == 0) {
                linkedHashMap.put(map$Entry.getKey(), map$Entry.getValue());
            }
        }
        return AbstractC0982q.L0(linkedHashMap.keySet());
    }

    public final Map l(String str, String str2, String str3, long j6) throws NoSuchAlgorithmException {
        String str4;
        ArrayList arrayList;
        String str5;
        ArrayList arrayList2;
        long j7;
        TimeInstantRangeFilter timeInstantRangeFilter;
        Long l6;
        J3.l.f(str, "startDate");
        J3.l.f(str2, "endDate");
        J3.l.f(str3, "timeZone");
        if (j6 != this.f1635b) {
            throw new IllegalStateException("CANCELLED");
        }
        if (Build$VERSION.SDK_INT < 34) {
            throw new IllegalStateException("ANDROID_14_HEALTH_CONNECT_REQUIRED");
        }
        List listA = C0071f0.f1640a.a(str, str2, str3);
        ZoneId zoneIdOf = ZoneId.of(str3);
        LocalDate localDateNow = LocalDate.now(zoneIdOf);
        if (((LocalDate) AbstractC0982q.n0(listA)).isAfter(localDateNow) || ((LocalDate) AbstractC0982q.b0(listA)).isBefore(localDateNow.minusDays(29L))) {
            throw new IllegalArgumentException("HEALTH_RANGE_INVALID");
        }
        this.f1636c = System.nanoTime() + TimeUnit.SECONDS.toNanos(90L);
        List listK = k();
        if (listK.isEmpty()) {
            throw new IllegalStateException("HEALTH_PERMISSION_REQUIRED");
        }
        HealthConnectManager healthConnectManagerA = AbstractC0072g.a(this.f1634a.getSystemService(Q.a()));
        if (healthConnectManagerA == null) {
            throw new IllegalStateException("HEALTH_PROVIDER_UNAVAILABLE");
        }
        TimeInstantRangeFilter timeInstantRangeFilterA = V.a(U.a(T.a(AbstractC0084m.a(), ((LocalDate) AbstractC0982q.b0(listA)).atStartOfDay(zoneIdOf).toInstant()), ((LocalDate) AbstractC0982q.n0(listA)).plusDays(1L).atStartOfDay(zoneIdOf).toInstant()));
        J3.l.e(timeInstantRangeFilterA, "build(...)");
        ArrayList arrayList3 = new ArrayList();
        if (listK.contains("steps")) {
            str4 = "build(...)";
            List listT = t(healthConnectManagerA, AbstractC0086n.a(), timeInstantRangeFilterA, "steps", j6);
            ArrayList arrayList4 = new ArrayList(AbstractC0982q.u(listT, 10));
            Iterator it = listT.iterator();
            while (it.hasNext()) {
                arrayList4.add(s(S.a(AbstractC0088o.a(it.next())), "steps"));
            }
            arrayList = arrayList3;
            arrayList.addAll(arrayList4);
        } else {
            str4 = "build(...)";
            arrayList = arrayList3;
        }
        if (listK.contains("sleep")) {
            ArrayList arrayList5 = arrayList;
            j7 = j6;
            List listT2 = t(healthConnectManagerA, AbstractC0090p.a(), timeInstantRangeFilterA, "sleep", j7);
            ArrayList arrayList6 = new ArrayList(AbstractC0982q.u(listT2, 10));
            Iterator it2 = listT2.iterator();
            while (it2.hasNext()) {
                arrayList6.add(s(S.a(AbstractC0092q.a(it2.next())), "sleep"));
            }
            arrayList2 = arrayList5;
            str5 = "sleep";
            arrayList2.addAll(arrayList6);
        } else {
            str5 = "sleep";
            arrayList2 = arrayList;
            j7 = j6;
        }
        if (arrayList2.size() > 10000) {
            throw new IllegalStateException("HEALTH_RANGE_TOO_DENSE");
        }
        ArrayList arrayList7 = new ArrayList(AbstractC0982q.u(listA, 10));
        Iterator it3 = listA.iterator();
        while (true) {
            Iterator it4 = it3;
            if (!it3.hasNext()) {
                break;
            }
            LocalDate localDate = (LocalDate) it4.next();
            ArrayList arrayList8 = arrayList7;
            TimeInstantRangeFilter timeInstantRangeFilterA2 = V.a(U.a(T.a(AbstractC0084m.a(), localDate.atStartOfDay(zoneIdOf).toInstant()), localDate.plusDays(1L).atStartOfDay(zoneIdOf).toInstant()));
            String str6 = str4;
            J3.l.e(timeInstantRangeFilterA2, str6);
            TreeSet treeSetD = p143v3.U.d(new String[0]);
            Double dValueOf = null;
            if (listK.contains("steps")) {
                timeInstantRangeFilter = timeInstantRangeFilterA2;
                AggregationType aggregationTypeA = W.a();
                J3.l.e(aggregationTypeA, "STEPS_COUNT_TOTAL");
                I.a();
                AggregateRecordsRequest aggregateRecordsRequestA = AbstractC0068e.a(AbstractC0066d.a(AbstractC0107x.a(AbstractC0064c.a(timeInstantRangeFilter)), aggregationTypeA));
                J3.l.e(aggregateRecordsRequestA, str6);
                AggregateRecordsResponse aggregateRecordsResponseA = AbstractC0070f.a(h(j7, "steps", new X(healthConnectManagerA, aggregateRecordsRequestA, this)));
                Long l7 = (Long) AbstractC0074h.a(aggregateRecordsResponseA, aggregationTypeA);
                Set setA = AbstractC0076i.a(aggregateRecordsResponseA, aggregationTypeA);
                J3.l.e(setA, "getDataOrigins(...)");
                ArrayList arrayList9 = new ArrayList(AbstractC0982q.u(setA, 10));
                Iterator it5 = setA.iterator();
                while (it5.hasNext()) {
                    arrayList9.add(AbstractC0080k.a(AbstractC0078j.a(it5.next())));
                }
                treeSetD.addAll(arrayList9);
                l6 = l7;
            } else {
                timeInstantRangeFilter = timeInstantRangeFilterA2;
                l6 = null;
            }
            if (listK.contains(str5)) {
                AggregationType aggregationTypeA2 = AbstractC0082l.a();
                J3.l.e(aggregationTypeA2, "SLEEP_DURATION_TOTAL");
                I.a();
                AggregateRecordsRequest aggregateRecordsRequestA2 = AbstractC0068e.a(AbstractC0066d.a(AbstractC0107x.a(AbstractC0064c.a(timeInstantRangeFilter)), aggregationTypeA2));
                J3.l.e(aggregateRecordsRequestA2, str6);
                AggregateRecordsResponse aggregateRecordsResponseA2 = AbstractC0070f.a(h(j7, str5, new Y(healthConnectManagerA, aggregateRecordsRequestA2, this)));
                Long l8 = (Long) AbstractC0074h.a(aggregateRecordsResponseA2, aggregationTypeA2);
                dValueOf = l8 != null ? Double.valueOf(l8.longValue() / 3600000.0d) : null;
                Set setA2 = AbstractC0076i.a(aggregateRecordsResponseA2, aggregationTypeA2);
                J3.l.e(setA2, "getDataOrigins(...)");
                ArrayList arrayList10 = new ArrayList(AbstractC0982q.u(setA2, 10));
                Iterator it6 = setA2.iterator();
                while (it6.hasNext()) {
                    arrayList10.add(AbstractC0080k.a(AbstractC0078j.a(it6.next())));
                }
                treeSetD.addAll(arrayList10);
            }
            arrayList8.add(p143v3.L.k(p137u3.s.a("localDate", localDate.toString()), p137u3.s.a("steps", l6), p137u3.s.a("sleepHours", dValueOf), p137u3.s.a("origins", AbstractC0982q.L0(treeSetD))));
            arrayList7 = arrayList8;
            it3 = it4;
            zoneIdOf = zoneIdOf;
            str4 = str6;
            arrayList2 = arrayList2;
        }
        ArrayList arrayList11 = arrayList2;
        ArrayList arrayList12 = arrayList7;
        Iterator it7 = listK.iterator();
        while (it7.hasNext()) {
            j(j7, (String) it7.next());
        }
        List<Map> listD0 = AbstractC0982q.D0(arrayList11, p155x3.a.b(new Z(), new C0061a0(), new C0063b0()));
        JSONArray jSONArrayPut = new JSONArray().put(str).put(str2).put(str3).put(new JSONArray((Collection) listK));
        ArrayList arrayList13 = new ArrayList(AbstractC0982q.u(arrayList12, 10));
        for (Iterator it8 = arrayList12.iterator(); it8.hasNext(); it8 = it8) {
            LinkedHashMap linkedHashMap = (LinkedHashMap) it8.next();
            arrayList13.add(AbstractC0982q.m(linkedHashMap.get("localDate"), linkedHashMap.get("steps"), linkedHashMap.get("sleepHours"), linkedHashMap.get("origins")));
        }
        JSONArray jSONArrayPut2 = jSONArrayPut.put(new JSONArray((Collection) arrayList13));
        ArrayList arrayList14 = new ArrayList(AbstractC0982q.u(listD0, 10));
        for (Map map : listD0) {
            arrayList14.add(AbstractC0982q.m(map.get("id"), map.get("kind"), map.get("origin"), map.get("providerVersion"), map.get("modifiedAt"), map.get("startAt"), map.get("endAt"), map.get("startOffsetSeconds"), map.get("endOffsetSeconds"), map.get("value"), map.get("unit")));
        }
        String string = jSONArrayPut2.put(new JSONArray((Collection) arrayList14)).toString();
        J3.l.e(string, "toString(...)");
        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        byte[] bytes = string.getBytes(C0681d.f11148b);
        J3.l.e(bytes, "getBytes(...)");
        byte[] bArrDigest = messageDigest.digest(bytes);
        J3.l.e(bArrDigest, "digest(...)");
        return p143v3.L.k(p137u3.s.a("schema", "solaris-health-snapshot/1"), p137u3.s.a("provider", "android-health-connect"), p137u3.s.a("fetchedAt", Instant.now().toString()), p137u3.s.a("startDate", str), p137u3.s.a("endDate", str2), p137u3.s.a("timeZone", str3), p137u3.s.a("grantedScopes", listK), p137u3.s.a("complete", Boolean.TRUE), p137u3.s.a("snapshotHash", AbstractC0975j.Z(bArrDigest, "", null, null, 0, null, new C0065c0(), 30, null)), p137u3.s.a("daily", arrayList12), p137u3.s.a("records", listD0));
    }

    /* JADX WARN: Code duplicated, block: B:7:0x0014  */
    public final Map v() {
        boolean z6;
        if (Build$VERSION.SDK_INT >= 34) {
            try {
                if (this.f1634a.getSystemService(Q.a()) != null) {
                    z6 = true;
                } else {
                    z6 = false;
                }
            } catch (Exception unused) {
            }
        } else {
            z6 = false;
        }
        Pair pairA = p137u3.s.a("provider", "android-health-connect");
        Pair pairA2 = p137u3.s.a("available", Boolean.valueOf(z6));
        Pair pairA3 = p137u3.s.a("reason", z6 ? null : "ANDROID_14_HEALTH_CONNECT_REQUIRED");
        Pair pairA4 = p137u3.s.a("grantedScopes", z6 ? k() : AbstractC0982q.j());
        Pair pairA5 = p137u3.s.a("supportedScopes", AbstractC0982q.m("steps", "sleep"));
        Pair pairA6 = p137u3.s.a("readOnly", Boolean.TRUE);
        Boolean bool = Boolean.FALSE;
        return p143v3.L.k(pairA, pairA2, pairA3, pairA4, pairA5, pairA6, p137u3.s.a("backgroundRead", bool), p137u3.s.a("extendedHistory", bool));
    }

    public final long w() {
        return this.f1635b;
    }
}
