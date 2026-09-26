package L5;

import android.net.Uri;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;
import p027d5.AbstractC0678a;
import p143v3.AbstractC0975j;
import p143v3.AbstractC0982q;
import p143v3.L;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
final class m$h$a implements I3.a {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f1820f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    final /* synthetic */ Uri f1821g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    final /* synthetic */ char[] f1822h;

    m$h$a(m mVar, Uri uri, char[] cArr) {
        this.f1820f = mVar;
        this.f1821g = uri;
        this.f1822h = cArr;
    }

    @Override // I3.a
    public final Object invoke() {
        try {
            b bVar = b.f1735a;
            byte[] bArrA = bVar.a(c.f1737a.a(m.E(this.f1820f), this.f1821g), this.f1822h);
            AbstractC0975j.p(this.f1822h, (char) 0, 0, 0, 6, null);
            try {
                String strE = bVar.e(bArrA);
                n.f1840a.a(strE);
                JSONObject jSONObject = new JSONObject(strE);
                if (!J3.l.b(jSONObject.getString("format"), "solaris-core-payload/1")) {
                    throw new IllegalArgumentException("RECOVERY_INVALID");
                }
                JSONObject jSONObject2 = jSONObject.getJSONObject("ownerCapsule");
                if (!J3.l.b(jSONObject2.getString("format"), "solaris-owner-recovery/1")) {
                    throw new IllegalArgumentException("RECOVERY_INVALID");
                }
                Iterator it = AbstractC0982q.m("ownerSecret", "receiptKey").iterator();
                while (it.hasNext()) {
                    String string = jSONObject2.getString((String) it.next());
                    J3.l.e(string, "getString(...)");
                    if (!new p027d5.o("[a-f0-9]{64}").e(string)) {
                        throw new IllegalArgumentException("RECOVERY_INVALID");
                    }
                }
                if (!J3.l.b(jSONObject2.getString("subjectId"), jSONObject.getJSONObject("manifest").getString("subjectId")) || !J3.l.b(jSONObject2.getString("ownerId"), jSONObject.getJSONObject("manifest").getString("ownerId"))) {
                    throw new IllegalArgumentException("RECOVERY_INVALID");
                }
                String string2 = jSONObject2.getString("receiptKey");
                J3.l.e(string2, "getString(...)");
                List listC1 = p027d5.q.c1(string2, 2);
                ArrayList arrayList = new ArrayList(AbstractC0982q.u(listC1, 10));
                Iterator it2 = listC1.iterator();
                while (it2.hasNext()) {
                    arrayList.add(Byte.valueOf((byte) Integer.parseInt((String) it2.next(), AbstractC0678a.a(16))));
                }
                byte[] bArrG0 = AbstractC0982q.G0(arrayList);
                try {
                    JSONArray jSONArray = jSONObject.getJSONObject("records").getJSONArray("receipts");
                    if (jSONArray.length() <= 50000) {
                        int length = jSONArray.length();
                        for (int i6 = 0; i6 < length; i6++) {
                            JSONObject jSONObject3 = jSONArray.getJSONObject(i6);
                            b bVar2 = b.f1735a;
                            String string3 = jSONObject3.getString("body");
                            J3.l.e(string3, "getString(...)");
                            String string4 = jSONObject3.getString("mac");
                            J3.l.e(string4, "getString(...)");
                            if (!bVar2.f(string3, bArrG0, string4)) {
                                throw new IllegalArgumentException("RECOVERY_INVALID");
                            }
                        }
                        AbstractC0975j.o(bArrG0, (byte) 0, 0, 0, 6, null);
                        m.W(this.f1820f, jSONObject);
                        JSONObject jSONObject4 = new JSONObject(strE);
                        jSONObject4.remove("ownerCapsule");
                        Map mapL = L.l(p137u3.s.a("payload", jSONObject4.toString()), p137u3.s.a("canRestore", Boolean.valueOf(!m.L(this.f1820f).d())));
                        AbstractC0975j.o(bArrA, (byte) 0, 0, 0, 6, null);
                        return mapL;
                    }
                    try {
                        throw new IllegalArgumentException("RECOVERY_INVALID");
                    } catch (Throwable th) {
                        th = th;
                    }
                } catch (Throwable th2) {
                    th = th2;
                }
                AbstractC0975j.o(bArrG0, (byte) 0, 0, 0, 6, null);
                throw th;
            } catch (Throwable th3) {
                AbstractC0975j.o(bArrA, (byte) 0, 0, 0, 6, null);
                throw th3;
            }
        } catch (Throwable th4) {
            AbstractC0975j.p(this.f1822h, (char) 0, 0, 0, 6, null);
            throw th4;
        }
    }
}
