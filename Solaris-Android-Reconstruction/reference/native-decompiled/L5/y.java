package L5;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.AlertDialog$Builder;
import android.content.DialogInterface;
import android.content.DialogInterface$OnClickListener;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import kotlin.jvm.functions.Function1;
import p143v3.AbstractC0975j;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class y {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final y f1874a = new y();

    private y() {
    }

    public static /* synthetic */ void a(EditText editText, boolean z6, EditText editText2, AlertDialog alertDialog, Function1 function1, View view) {
        k(editText, z6, editText2, alertDialog, function1, view);
    }

    public static /* synthetic */ void b(EditText editText, EditText editText2, Function1 function1, DialogInterface dialogInterface) {
        i(editText, editText2, function1, dialogInterface);
    }

    public static /* synthetic */ void c(Activity activity, boolean z6, Function1 function1) {
        g(activity, z6, function1);
    }

    public static /* synthetic */ void d(AlertDialog alertDialog, EditText editText, boolean z6, EditText editText2, Function1 function1, DialogInterface dialogInterface) {
        j(alertDialog, editText, z6, editText2, function1, dialogInterface);
    }

    public static /* synthetic */ void e(EditText editText, EditText editText2, Function1 function1, DialogInterface dialogInterface, int i6) {
        h(editText, editText2, function1, dialogInterface, i6);
    }

    private static final void g(Activity activity, boolean z6, Function1 function1) {
        LinearLayout linearLayout = new LinearLayout(activity);
        linearLayout.setOrientation(1);
        linearLayout.setPadding(40, 20, 40, 0);
        TextView textView = new TextView(activity);
        textView.setText("Use a long, unique passphrase (at least 20 characters). Keep it separate from your recovery file. Solaris cannot reset it.");
        EditText editText = new EditText(activity);
        editText.setHint("Recovery passphrase");
        editText.setInputType(129);
        editText.setImportantForAutofill(2);
        EditText editText2 = new EditText(activity);
        editText2.setHint("Confirm passphrase");
        editText2.setInputType(editText.getInputType());
        editText2.setImportantForAutofill(2);
        linearLayout.addView(textView);
        linearLayout.addView(editText);
        if (z6) {
            linearLayout.addView(editText2);
        }
        AlertDialog alertDialogCreate = new AlertDialog$Builder(activity).setTitle(z6 ? "Protect your recovery file" : "Open your recovery file").setView(linearLayout).setPositiveButton("Continue", (DialogInterface$OnClickListener) null).setNegativeButton("Cancel", new u(editText, editText2, function1)).create();
        alertDialogCreate.setOnCancelListener(new v(editText, editText2, function1));
        alertDialogCreate.setOnShowListener(new w(alertDialogCreate, editText, z6, editText2, function1));
        a aVar = a.f1734a;
        a.b(aVar, alertDialogCreate.getWindow(), false, 2, null);
        alertDialogCreate.show();
        a.b(aVar, alertDialogCreate.getWindow(), false, 2, null);
    }

    private static final void h(EditText editText, EditText editText2, Function1 function1, DialogInterface dialogInterface, int i6) {
        editText.getText().clear();
        editText2.getText().clear();
        function1.q(null);
    }

    private static final void i(EditText editText, EditText editText2, Function1 function1, DialogInterface dialogInterface) {
        editText.getText().clear();
        editText2.getText().clear();
        function1.q(null);
    }

    private static final void j(AlertDialog alertDialog, EditText editText, boolean z6, EditText editText2, Function1 function1, DialogInterface dialogInterface) {
        alertDialog.getButton(-1).setOnClickListener(new x(editText, z6, editText2, alertDialog, function1));
    }

    private static final void k(EditText editText, boolean z6, EditText editText2, AlertDialog alertDialog, Function1 function1, View view) {
        char[] charArray = editText.getText().toString().toCharArray();
        J3.l.e(charArray, "toCharArray(...)");
        try {
            try {
                b bVar = b.f1735a;
                char[] cArrD = bVar.d(charArray);
                if (z6) {
                    String str = new String(cArrD);
                    char[] charArray2 = editText2.getText().toString().toCharArray();
                    J3.l.e(charArray2, "toCharArray(...)");
                    if (!J3.l.b(str, new String(bVar.d(charArray2)))) {
                        throw new IllegalStateException("PASSPHRASE_MISMATCH");
                    }
                }
                editText.getText().clear();
                editText2.getText().clear();
                alertDialog.dismiss();
                function1.q(cArrD);
            } catch (Exception unused) {
                editText.setError("Use at least 20 characters and matching entries.");
            }
            AbstractC0975j.p(charArray, (char) 0, 0, 0, 6, null);
        } catch (Throwable th) {
            AbstractC0975j.p(charArray, (char) 0, 0, 0, 6, null);
            throw th;
        }
    }

    public final void f(Activity activity, boolean z6, Function1 function1) {
        J3.l.f(activity, "activity");
        J3.l.f(function1, "done");
        activity.runOnUiThread(new t(activity, z6, function1));
    }
}
