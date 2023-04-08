import { Links } from './Constants';

const MAIN_INTRODUCTION = `
Welcome to the SMLSlang playground!

The language [_SMLSlang_](${'https://github.com/sebastiantoh/sml-slang'}) is an adaptation of the language [_SML_](${'https://www.smlnj.org/sml.html/'}). `;

const HOTKEYS_INTRODUCTION = `

In the editor on the left, you can use the [_Ace keyboard shortcuts_](${Links.aceHotkeys})
and also the [_Source Academy keyboard shortcuts_](${Links.sourceHotkeys}).

`;

export const generateSourceIntroduction = () => {
  return MAIN_INTRODUCTION + HOTKEYS_INTRODUCTION;
};

export const generateSmlExamples = () => {
  return `
In the editor on the left, you can run full SML programs. For example,

\`\`\`

fun fib n =
  let
    fun loop acc i =
      if i > n then
        rev acc
      else
        case acc of
          [] => loop [0] (i + 1)
        | [0] => loop (1::acc) (i + 1)
        | snd::fst::_ => loop ((fst+snd)::acc) (i + 1)
  in
    loop [] 0
end

val () = (
  print (fib 0);
  print (fib 1);
  print (fib 2);
  print (fib 20)
)
\`\`\`

In the REPL below, you can evaluate SML expressions. For example
\`\`\`
let
  val bool_list = [true, true, false]
  val empty_list = []
  val is_list_empty = fn [] => print "empty" | hd::tl => print "nonempty"
  val concat_lists = fn l1 => fn l2 => l1 @ l2
  val take_heads = fn hd1::tl1 => fn hd2::tl2 => [hd1,hd2]
  val take_tails = fn hd1::tl1 => fn hd2::tl2 => tl1 @ tl2
  val take_head_or_default = fn [x] => [1,2,3] | hd::tl => [hd]
  val list_to_int = fn [] => 1 | [x] => 2 | x => 3
  val list_of_lists_to_lists = fn [l1,l2] => l1 @ l2
  val add_two_heads = fn fst::snd::tl => (fst+snd)::tl
in
  add_two_heads
end
\`\`\`
  `;
};
