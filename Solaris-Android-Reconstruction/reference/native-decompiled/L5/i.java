package L5;

import android.app.Activity;
import org.json.JSONObject;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class i implements Runnable {

    /* JADX INFO: renamed from: f, reason: collision with root package name */
    public final /* synthetic */ long f1744f;

    /* JADX INFO: renamed from: g, reason: collision with root package name */
    public final /* synthetic */ m f1745g;

    /* JADX INFO: renamed from: h, reason: collision with root package name */
    public final /* synthetic */ Activity f1746h;

    /* JADX INFO: renamed from: i, reason: collision with root package name */
    public final /* synthetic */ boolean f1747i;

    /* JADX INFO: renamed from: j, reason: collision with root package name */
    public final /* synthetic */ String f1748j;

    /* JADX INFO: renamed from: k, reason: collision with root package name */
    public final /* synthetic */ JSONObject f1749k;

    public /* synthetic */ i(long j6, m mVar, Activity activity, boolean z6, String str, JSONObject jSONObject) {
        this.f1744f = j6;
        this.f1745g = mVar;
        this.f1746h = activity;
        this.f1747i = z6;
        this.f1748j = str;
        this.f1749k = jSONObject;
    }

    @Override // java.lang.Runnable
    public final void run() {
        m.l(this.f1744f, this.f1745g, this.f1746h, this.f1747i, this.f1748j, this.f1749k);
    }
}
