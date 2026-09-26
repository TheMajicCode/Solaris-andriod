package L5;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.DialogInterface$OnShowListener;
import android.widget.EditText;
import kotlin.jvm.functions.Function1;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final /* synthetic */ class w implements DialogInterface$OnShowListener {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public final /* synthetic */ AlertDialog f1864a;

    /* JADX INFO: renamed from: b, reason: collision with root package name */
    public final /* synthetic */ EditText f1865b;

    /* JADX INFO: renamed from: c, reason: collision with root package name */
    public final /* synthetic */ boolean f1866c;

    /* JADX INFO: renamed from: d, reason: collision with root package name */
    public final /* synthetic */ EditText f1867d;

    /* JADX INFO: renamed from: e, reason: collision with root package name */
    public final /* synthetic */ Function1 f1868e;

    public /* synthetic */ w(AlertDialog alertDialog, EditText editText, boolean z6, EditText editText2, Function1 function1) {
        this.f1864a = alertDialog;
        this.f1865b = editText;
        this.f1866c = z6;
        this.f1867d = editText2;
        this.f1868e = function1;
    }

    @Override // android.content.DialogInterface$OnShowListener
    public final void onShow(DialogInterface dialogInterface) {
        y.d(this.f1864a, this.f1865b, this.f1866c, this.f1867d, this.f1868e, dialogInterface);
    }
}
