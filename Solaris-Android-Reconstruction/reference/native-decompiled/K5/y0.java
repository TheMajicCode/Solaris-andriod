package K5;

import com.facebook.react.fabric.mounting.mountitems.IntBufferBatchMountItem;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

/* JADX INFO: loaded from: /workspace/scratch/7a1f5a13b137/reconstruction-work/code601-classes.dex */
public final class y0 {

    /* JADX INFO: renamed from: a, reason: collision with root package name */
    public static final y0 f1692a = new y0();

    private y0() {
    }

    public final String a(int i6) {
        if (i6 == 1 || i6 == 2) {
            return "RESOURCE_DOWNLOAD_NETWORK";
        }
        if (i6 == 4) {
            return "VOICE_PROVIDER_ERROR";
        }
        switch (i6) {
            case IntBufferBatchMountItem.INSTRUCTION_INSERT /* 8 */:
            case 10:
                return "VOICE_PROVIDER_BUSY";
            case 9:
                return "MICROPHONE_REQUIRED";
            case 11:
                return "VOICE_PROVIDER_DISCONNECTED";
            case 12:
                return "LANGUAGE_NOT_SUPPORTED";
            case 13:
                return "LANGUAGE_RESOURCE_REQUIRED";
            case 14:
                return "LANGUAGE_CHECK_UNAVAILABLE";
            case 15:
                return "RESOURCE_DOWNLOAD_EVENTS_UNAVAILABLE";
            default:
                return "RESOURCE_DOWNLOAD_FAILED";
        }
    }

    public final String b(String str, List list) {
        Object next;
        J3.l.f(str, "tag");
        J3.l.f(list, "languages");
        String strC = c(str);
        Object obj = null;
        if (strC == null) {
            return null;
        }
        Iterator it = list.iterator();
        do {
            if (!it.hasNext()) {
                next = null;
                break;
            }
            next = it.next();
        } while (!p027d5.q.u((String) next, str, true));
        String str2 = (String) next;
        if (str2 != null) {
            return str2;
        }
        for (Object obj2 : list) {
            if (J3.l.b(f1692a.c((String) obj2), strC)) {
                obj = obj2;
                break;
            }
        }
        return (String) obj;
    }

    public final String c(String str) {
        String language;
        J3.l.f(str, "tag");
        if (str.length() > 35) {
            str = null;
        }
        if (str == null || (language = Locale.forLanguageTag(str).getLanguage()) == null) {
            return null;
        }
        if (J3.l.b(language, "en") || J3.l.b(language, "es")) {
            return language;
        }
        return null;
    }

    public final y0$a d(String str, List list, List list2, List list3) {
        J3.l.f(str, "tag");
        J3.l.f(list, "installed");
        J3.l.f(list2, "pending");
        J3.l.f(list3, "supported");
        y0 y0Var = f1692a;
        String strB = y0Var.b(str, list);
        if (strB != null) {
            return new y0$a("ready", strB, null);
        }
        String strB2 = y0Var.b(str, list2);
        if (strB2 != null) {
            return new y0$a("pending", strB2, "RESOURCE_DOWNLOAD_SCHEDULED");
        }
        String strB3 = y0Var.b(str, list3);
        return strB3 != null ? new y0$a("required", strB3, "LANGUAGE_RESOURCE_REQUIRED") : new y0$a("unavailable", str, "LANGUAGE_NOT_SUPPORTED");
    }

    public final String e(String str) {
        J3.l.f(str, "text");
        String string = p027d5.q.Y0(str).toString();
        if (string.length() <= 0 || string.length() > 4000 || p027d5.q.N(string, (char) 0, false, 2, null)) {
            return null;
        }
        return string;
    }
}
