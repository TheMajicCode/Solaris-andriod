// Analysis harness only. Sequentially evaluates files in one official Hermes VM.
// Does not access Android, the user's device, network, or app storage.
#include <hermes/hermes.h>
#include <jsi/jsi.h>
#include <fstream>
#include <iostream>
#include <sstream>
#include <stdexcept>
using namespace facebook;
int main(int argc, char **argv) {
  try {
    auto runtime = facebook::hermes::makeHermesRuntime(
      ::hermes::vm::RuntimeConfig::Builder().withMicrotaskQueue(true).build());
    auto &rt = *runtime;
    rt.global().setProperty(rt, "print", jsi::Function::createFromHostFunction(
      rt, jsi::PropNameID::forAscii(rt, "print"), 1,
      [](jsi::Runtime &r, const jsi::Value &, const jsi::Value *args, size_t count) {
        for (size_t i=0;i<count;++i) { if(i) std::cout<<" "; std::cout<<args[i].toString(r).utf8(r); }
        std::cout<<std::endl; return jsi::Value::undefined();
      }));
    for (int i=1;i<argc;++i) {
      std::ifstream in(argv[i],std::ios::binary); if(!in) throw std::runtime_error("Cannot open input");
      std::ostringstream bytes; bytes<<in.rdbuf();
      rt.evaluateJavaScript(std::make_shared<jsi::StringBuffer>(bytes.str()),argv[i]);
      rt.drainMicrotasks();
    }
    return 0;
  } catch (const jsi::JSError &e) { std::cerr<<e.what()<<std::endl; return 2;
  } catch (const std::exception &e) { std::cerr<<e.what()<<std::endl; return 3; }
}
