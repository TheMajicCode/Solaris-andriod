package org.solarishealth.edge.recovery;

import J3.l;
import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;
import com.facebook.react.InterfaceC0667v;
import com.facebook.react.InterfaceC0670y;
import com.facebook.react.L;
import com.facebook.react.N;
import java.util.Locale;
import kotlin.Metadata;
import p129t1.e;
import p160y2.a;
import p160y2.o;
import p160y2.o$a;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
@Metadata(d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\b\u0004\u0018\u00002\u00020\u00012\u00020\u0002B\u0007¢\u0006\u0004\b\u0003\u0010\u0004J\u000f\u0010\u0006\u001a\u00020\u0005H\u0016¢\u0006\u0004\b\u0006\u0010\u0004J\u0017\u0010\t\u001a\u00020\u00052\u0006\u0010\b\u001a\u00020\u0007H\u0016¢\u0006\u0004\b\t\u0010\nR\u001a\u0010\u0010\u001a\u00020\u000b8\u0016X\u0096\u0004¢\u0006\f\n\u0004\b\f\u0010\r\u001a\u0004\b\u000e\u0010\u000fR\u0014\u0010\u0014\u001a\u00020\u00118VX\u0096\u0004¢\u0006\u0006\u001a\u0004\b\u0012\u0010\u0013¨\u0006\u0015"}, d2 = {"Lorg/solarishealth/edge/recovery/MainApplication;", "Landroid/app/Application;", "Lcom/facebook/react/v;", "<init>", "()V", "Lu3/A;", "onCreate", "Landroid/content/res/Configuration;", "newConfig", "onConfigurationChanged", "(Landroid/content/res/Configuration;)V", "Lcom/facebook/react/N;", "f", "Lcom/facebook/react/N;", "a", "()Lcom/facebook/react/N;", "reactNativeHost", "Lcom/facebook/react/y;", "b", "()Lcom/facebook/react/y;", "reactHost", "app_release"}, k = 1, mv = {2, 1, 0}, xi = 48)
public final class MainApplication extends Application implements InterfaceC0667v {

    /* JADX INFO: renamed from: f, reason: collision with root package name and from kotlin metadata */
    private final N reactNativeHost = new o(this, new MainApplication$a(this));

    @Override // com.facebook.react.InterfaceC0667v
    /* JADX INFO: renamed from: a, reason: from getter */
    public N getReactNativeHost() {
        return this.reactNativeHost;
    }

    @Override // com.facebook.react.InterfaceC0667v
    public InterfaceC0670y b() {
        o$a o_a = o.f17043f;
        Context applicationContext = getApplicationContext();
        l.e(applicationContext, "getApplicationContext(...)");
        return o_a.a(applicationContext, getReactNativeHost());
    }

    @Override // android.app.Application, android.content.ComponentCallbacks
    public void onConfigurationChanged(Configuration newConfig) {
        l.f(newConfig, "newConfig");
        super.onConfigurationChanged(newConfig);
        a.c(this, newConfig);
    }

    @Override // android.app.Application
    public void onCreate() {
        e eVarValueOf;
        super.onCreate();
        com.facebook.react.defaults.a aVar = com.facebook.react.defaults.a.f8995a;
        try {
            String upperCase = "stable".toUpperCase(Locale.ROOT);
            l.e(upperCase, "toUpperCase(...)");
            eVarValueOf = e.valueOf(upperCase);
        } catch (IllegalArgumentException unused) {
            eVarValueOf = e.STABLE;
        }
        aVar.e(eVarValueOf);
        L.a(this);
        a.b(this);
    }
}
