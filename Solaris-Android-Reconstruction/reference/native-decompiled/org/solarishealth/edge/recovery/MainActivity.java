package org.solarishealth.edge.recovery;

import android.os.Build$VERSION;
import android.os.Bundle;
import com.facebook.react.AbstractActivityC0620q;
import com.facebook.react.C0622t;
import com.facebook.react.defaults.a;
import kotlin.Metadata;
import p160y2.m;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
@Metadata(d1 = {"\u0000*\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\u0018\u00002\u00020\u0001B\u0007¢\u0006\u0004\b\u0002\u0010\u0003J\u0019\u0010\u0007\u001a\u00020\u00062\b\u0010\u0005\u001a\u0004\u0018\u00010\u0004H\u0014¢\u0006\u0004\b\u0007\u0010\bJ\u000f\u0010\n\u001a\u00020\tH\u0014¢\u0006\u0004\b\n\u0010\u000bJ\u000f\u0010\r\u001a\u00020\fH\u0014¢\u0006\u0004\b\r\u0010\u000eJ\u000f\u0010\u000f\u001a\u00020\u0006H\u0016¢\u0006\u0004\b\u000f\u0010\u0003¨\u0006\u0010"}, d2 = {"Lorg/solarishealth/edge/recovery/MainActivity;", "Lcom/facebook/react/q;", "<init>", "()V", "Landroid/os/Bundle;", "savedInstanceState", "Lu3/A;", "onCreate", "(Landroid/os/Bundle;)V", "", "k0", "()Ljava/lang/String;", "Lcom/facebook/react/t;", "i0", "()Lcom/facebook/react/t;", "c", "app_release"}, k = 1, mv = {2, 1, 0}, xi = 48)
public final class MainActivity extends AbstractActivityC0620q {
    @Override // com.facebook.react.AbstractActivityC0620q, R1.a
    public void c() {
        if (Build$VERSION.SDK_INT > 30) {
            super.c();
        } else {
            if (moveTaskToBack(false)) {
                return;
            }
            super.c();
        }
    }

    @Override // com.facebook.react.AbstractActivityC0620q
    protected C0622t i0() {
        return new m(this, true, new MainActivity$a(this, k0(), a.a()));
    }

    protected String k0() {
        return "main";
    }

    @Override // com.facebook.react.AbstractActivityC0620q, androidx.fragment.app.AbstractActivityC0509j, androidx.activity.ComponentActivity, androidx.core.app.d, android.app.Activity
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(J5.a.f1316a);
        super.onCreate(null);
    }
}
