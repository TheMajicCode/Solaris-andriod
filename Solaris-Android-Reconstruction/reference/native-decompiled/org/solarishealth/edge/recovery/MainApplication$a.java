package org.solarishealth.edge.recovery;

import J3.l;
import com.facebook.react.C0613j;
import com.facebook.react.defaults.d;
import java.util.ArrayList;
import java.util.List;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class MainApplication$a extends d {

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    private final boolean f14477c;

    MainApplication$a(MainApplication mainApplication) {
        super(mainApplication);
        this.f14477c = true;
    }

    @Override // com.facebook.react.N
    public boolean f() {
        return false;
    }

    @Override // com.facebook.react.N
    protected String getJSMainModuleName() {
        return ".expo/.virtual-metro-entry";
    }

    @Override // com.facebook.react.N
    protected List getPackages() {
        ArrayList arrayListA = new C0613j(this).a();
        l.e(arrayListA, "apply(...)");
        return arrayListA;
    }

    @Override // com.facebook.react.defaults.d
    protected boolean j() {
        return this.f14477c;
    }
}
