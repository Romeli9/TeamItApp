// src/screens/BelbinTestScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { useAppNavigation } from 'shared/libs/useAppNavigation';
import { Screens, Stacks } from 'app/navigation/navigationEnums';

// === ЦВЕТА ПРИЛОЖЕНИЯ ===
export const APP_COLORS = {
  primary: '#8A2BE2', // Яркий фиолетовый — как в меню
  primaryLight: '#f0e6ff',
  primaryDark: '#6A1CB0',
  background: '#fafbff',
  surface: '#ffffff',
  textPrimary: '#1e1e1e',
  textSecondary: '#666666',
  border: '#e0e0e6',
  error: '#e53935',
  success: '#2e7d32',
};

// === БЛОКИ ТЕСТА (7 блоков по 8 утверждений) ===
const BELBIN_BLOCKS = [
  // ... (вставьте полные блоки из предыдущего ответа — они уже корректны)
  // Для экономии места здесь оставим только структуру, но в реальном коде используйте полные блоки выше
  {
    block: 1,
    statements: [
      { id: '1a', text: 'Я легко беру на себя лидерские обязанности в группе.' },
      { id: '1b', text: 'Мне нравится анализировать информацию и находить ошибки.' },
      { id: '1c', text: 'Я думаю, что способен быстро замечать новые возможности и извлекать из них выгоды.' },
      { id: '1d', text: 'Я могу успешно работать с самыми разными людьми.' },
      { id: '1e', text: 'Генерация идей — моё врожденное достоинство.' },
      { id: '1f', text: 'Моим достоинством является умение находить людей, способных принести пользу команде.' },
      { id: '1g', text: 'Моя способность доводить всё до конца во многом обеспечила мою профессиональную эффективность.' },
      { id: '1h', text: 'Я готов перенести временную непопулярность, если вижу, что мои действия принесут в конечном счете полезные результаты.' },
    ],
  },
  {
    block: 2,
    statements: [
      { id: '2a', text: 'Я быстро выясняю, что сработает в данной ситуации, если в подобную ситуацию я уже попадал.' },
      { id: '2b', text: 'Личные заблуждения и предубеждения не мешают мне находить и доказывать преимущества альтернативных действий.' },
      { id: '2c', text: 'Я чувствую себя неуверенно на совещании, если отсутствуют четкая повестка дня и контроль за её соблюдением.' },
      { id: '2d', text: 'Я склонен быть слишком великодушным к людям, имеющим правильную точку зрения, но не высказывающим её открыто.' },
      { id: '2e', text: 'Я склонен слишком много говорить, когда в группе обсуждаются новые идеи.' },
      { id: '2f', text: 'Вследствие моей осмотрительности я не склонен быстро и с энтузиазмом присоединяться к мнению коллег.' },
      { id: '2g', text: 'Я иногда выгляжу авторитарным и нетерпимым, когда чувствую необходимость достичь чего-то.' },
      { id: '2h', text: 'Мне трудно повести людей за собой, поскольку я слишком подвержен влиянию атмосферы, царящей в группе.' },
    ],
  },
  {
    block: 3,
    statements: [
      { id: '3a', text: 'Я слишком захвачен идеями, которые мне приходят в голову, и поэтому плохо слежу за тем, что происходит вокруг.' },
      { id: '3b', text: 'Мои коллеги находят, что я слишком много внимания уделяю деталям и чрезмерно беспокоюсь о том, что дела идут неправильно.' },
      { id: '3c', text: 'Я умею влиять на людей, не оказывая на них давления.' },
      { id: '3d', text: 'Врожденная осмотрительность предохраняет меня от ошибок, возникающих из-за невнимательности.' },
      { id: '3e', text: 'Я готов оказать давление, чтобы совещание не превращалось в пустую трату времени и не терялась из виду основная цель обсуждения.' },
      { id: '3f', text: 'Можно рассчитывать на поступление от меня оригинальных предложений.' },
      { id: '3g', text: 'Я всегда готов поддержать любое предложение, если оно служит общим интересам.' },
      { id: '3h', text: 'Я энергично ищу среди новых идей и разработок свежайшие.' },
    ],
  },
  {
    block: 4,
    statements: [
      { id: '4a', text: 'Я надеюсь, что моя способность выносить беспристрастные суждения признаётся всеми, кто меня знает.' },
      { id: '4b', text: 'На меня можно возложить обязанности следить за тем, чтобы наиболее существенная работа была организована должным образом.' },
      { id: '4c', text: 'Я постоянно стараюсь лучше узнать своих коллег.' },
      { id: '4d', text: 'Я неохотно возражаю своим коллегам и не люблю сам быть в меньшинстве.' },
      { id: '4e', text: 'Я обычно нахожу вескую аргументацию против плохих предложений.' },
      { id: '4f', text: 'Я полагаю, что обладаю талантом быстро организовать исполнение одобренных планов.' },
      { id: '4g', text: 'Я обладаю способностью избегать очевидных решений и умею находить неожиданные.' },
      { id: '4h', text: 'Я стремлюсь добиться совершенства при исполнении любой роли в командной работе.' },
    ],
  },
  {
    block: 5,
    statements: [
      { id: '5a', text: 'Я умею устанавливать контакты с внешним окружением команды.' },
      { id: '5b', text: 'Я способен воспринимать любые высказываемые мнения, но без колебаний подчиняюсь мнению большинства после принятия решения.' },
      { id: '5c', text: 'Мне доставляет удовольствие анализ ситуаций и взвешивание всех шансов.' },
      { id: '5d', text: 'Мне нравится находить практические решения проблем.' },
      { id: '5e', text: 'Мне нравиться сознавать, что я создаю хорошие рабочие взаимоотношения.' },
      { id: '5f', text: 'Я способен оказывать сильное влияние на принятие решений.' },
      { id: '5g', text: 'Я получаю возможность встретиться с людьми, способными предложить что-то новое для меня.' },
      { id: '5h', text: 'Я способен добиться согласия людей на реализацию необходимого курса действий.' },
    ],
  },
  {
    block: 6,
    statements: [
      { id: '6a', text: 'Я чувствую себя в своей стихии, когда могу уделить задаче все мое внимание.' },
      { id: '6b', text: 'Мне нравится находить задачи, требующие напряжения воображения.' },
      { id: '6c', text: 'Я бы почувствовал необходимость сначала в одиночестве обдумать пути выхода из тупика, прежде чем начать действовать.' },
      { id: '6d', text: 'Я был бы готов работать с человеком, указавшим наиболее позитивный подход, каковы бы ни были связанные с этим трудности.' },
      { id: '6e', text: 'Я бы попытался найти способ разбиения задачи на части в соответствии с тем, что лучше всего умеют делать отдельные члены команды.' },
      { id: '6f', text: 'Присущая мне обязательность помогла бы нам не отстать от графика.' },
      { id: '6g', text: 'Я надеюсь, мне бы удалось сохранить хладнокровие и способность логически мыслить.' },
      { id: '6h', text: 'Я бы упорно добивался достижения цели, несмотря ни на какие помехи.' },
    ],
  },
  {
    block: 7,
    statements: [
      { id: '7a', text: 'Я был бы готов действовать силой положительного примера при появлении признаков отсутствия прогресса в командной работе.' },
      { id: '7b', text: 'Я бы организовал дискуссию, чтобы стимулировать выдвижение новых идей и придать начальный импульс командной работе.' },
      { id: '7c', text: 'Я склонен проявлять нетерпимость по отношению к людям, мешающим, по моему мнению, прогрессу в делах группы.' },
      { id: '7d', text: 'Окружающие иногда критикуют меня за чрезмерный рационализм и неспособность к интуитивным решениям.' },
      { id: '7e', text: 'Мое стремление обеспечить условия, чтобы работа выполнялась правильно, может приводить к снижению темпов.' },
      { id: '7f', text: 'Я слишком быстро утрачиваю энтузиазм и стараюсь почерпнуть его у наиболее активных членов группы.' },
      { id: '7g', text: 'Я тяжел на подъем, если не имею ясных целей.' },
      { id: '7h', text: 'Мне иногда бывает очень трудно разобраться во встретившихся мне сложностях.' },
    ],
  },
];

export const Belbin = () => {
  const { navigate } = useAppNavigation();
  const [isStarted, setIsStarted] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<number, string | null>>({});
  const [loading, setLoading] = useState(false);

  // Инициализация ответов для текущего блока
  useEffect(() => {
    if (!isStarted) return;
    const block = BELBIN_BLOCKS[currentBlockIndex];
    const init: Record<string, number> = {};
    block.statements.forEach(stmt => {
      if (answers[stmt.id] === undefined) {
        init[stmt.id] = 0;
      }
    });
    if (Object.keys(init).length > 0) {
      setAnswers(prev => ({ ...prev, ...init }));
    }
  }, [currentBlockIndex, isStarted]);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleInputChange = (id: string, value: string) => {
    const num = value === '' ? 0 : Number(value);
    if (isNaN(num) || num < 0 || num > 10) return;
    setAnswers(prev => ({ ...prev, [id]: num }));
  };

  // Защита от ошибок, если блок не загружен
  const currentBlock = BELBIN_BLOCKS[currentBlockIndex] || BELBIN_BLOCKS[0];
  const blockTotal = currentBlock.statements.reduce((sum, stmt) => sum + (answers[stmt.id] || 0), 0);
  const totalStatements = BELBIN_BLOCKS.reduce((sum, b) => sum + b.statements.length, 0);
  const progress = Object.keys(answers).length / totalStatements;

  const validateBlock = () => {
    if (blockTotal !== 10) {
      setErrors(prev => ({ ...prev, [currentBlockIndex]: `Сумма должна быть 10 (сейчас: ${blockTotal})` }));
      return false;
    }
    setErrors(prev => ({ ...prev, [currentBlockIndex]: null }));
    return true;
  };

  const handleNext = () => {
    if (!validateBlock()) return;
    if (currentBlockIndex < BELBIN_BLOCKS.length - 1) {
      setCurrentBlockIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
  setLoading(true);

  // Валидация всех блоков
  for (let i = 0; i < BELBIN_BLOCKS.length; i++) {
    const total = BELBIN_BLOCKS[i].statements.reduce((s, stmt) => s + (answers[stmt.id] || 0), 0);
    if (total !== 10) {
      Alert.alert('Ошибка', `В блоке ${i + 1} сумма не равна 10.`);
      setCurrentBlockIndex(i);
      setLoading(false);
      return;
    }
  }

  // === РАСЧЁТ РОЛЕЙ ===
  const roleScores = Array(8).fill(0); // 8 ролей

  // Соответствие утверждений ролям (a=0, b=1, ..., h=7)
  const ROLE_MAPPING = [
    // Блок 1
    [1, 0], [5], [4], [6], [3], [4], [7], [2],
    // Блок 2
    [0], [5], [1], [6], [3], [5], [2], [6],
    // Блок 3
    [3], [0], [6], [5], [1], [3], [6], [4],
    // Блок 4
    [5], [0], [6], [1], [5], [7], [3], [7],
    // Блок 5
    [4], [1], [5], [7], [6], [2], [4], [1],
    // Блок 6
    [7], [3], [1], [4], [6], [0], [5], [7],
    // Блок 7
    [2], [3], [2], [5], [7], [6], [1], [5],
  ];

  for (let block = 0; block < 7; block++) {
    const blockAnswers = BELBIN_BLOCKS[block].statements.map(stmt => answers[stmt.id] || 0);
    for (let stmt = 0; stmt < 8; stmt++) {
      const score = blockAnswers[stmt];
      const roles = ROLE_MAPPING[block * 8 + stmt];
      roles.forEach(roleIndex => {
        roleScores[roleIndex] += score;
      });
    }
  }

  // Сохраните результаты в Redux или передайте напрямую
  // Для простоты — передаём через навигацию
  
  navigate(Screens.PROFILE, { belbinResults: roleScores });
  setLoading(false);
};

  // === Обложка (всегда показывается при входе) ===
  if (!isStarted) {
    return (
      <View style={styles.coverContainer}>
        <View style={styles.coverContent}>
          <Text style={styles.coverTitle}>Тест Белбина</Text>
          <Text style={styles.coverSubtitle}>
            Определите свои командные роли и узнайте, как вы можете внести максимальный вклад в работу группы.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Начать тест</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // === Основной тест ===
  return (
    <View style={styles.testContainer}>
      <View style={styles.header}>
        <Text style={styles.blockTitle}>Блок {currentBlock.block} из 7</Text>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.instructions}>
          Распределите 10 баллов между утверждениями ниже. Сумма = 10.
        </Text>

        {currentBlock.statements.map((stmt, idx) => (
          <View key={stmt.id} style={styles.statementContainer}>
            <Text style={styles.statementText}>
              {String.fromCharCode(97 + idx)}. {stmt.text}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={answers[stmt.id]?.toString() || '0'}
                onChangeText={val => handleInputChange(stmt.id, val)}
                keyboardType="numeric"
                maxLength={2}
                onBlur={Keyboard.dismiss}
              />
              <Text style={styles.inputLabel}>баллов</Text>
            </View>
          </View>
        ))}

        <View
          style={[
            styles.totalBox,
            { backgroundColor: blockTotal === 10 ? APP_COLORS.success + '15' : APP_COLORS.error + '15' },
          ]}>
          <Text
            style={[
              styles.totalText,
              { color: blockTotal === 10 ? APP_COLORS.success : APP_COLORS.error },
            ]}>
            Сумма: {blockTotal} / 10
          </Text>
          {errors[currentBlockIndex] && (
            <Text style={styles.errorText}>{errors[currentBlockIndex]}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonRow}>
        {currentBlockIndex > 0 && (
          <TouchableOpacity style={[styles.navButton, styles.backButton]} onPress={handlePrev}>
            <Text style={styles.navButtonText}>Назад</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
          disabled={loading}>
          <Text style={styles.nextButtonText}>
            {currentBlockIndex === BELBIN_BLOCKS.length - 1 ? 'Завершить' : 'Далее'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  coverContainer: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  coverContent: {
    maxWidth: 600,
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 16,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: APP_COLORS.primary, // ✅ Фиолетовый!
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  testContainer: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  blockTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
  },
  progressText: {
    fontSize: 14,
    color: APP_COLORS.textSecondary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#e0e0e6',
    borderRadius: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: APP_COLORS.primary, // ✅ Фиолетовый прогресс!
  },
  instructions: {
    fontSize: 15,
    color: APP_COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  statementContainer: {
    marginBottom: 22,
  },
  statementText: {
    fontSize: 16,
    color: APP_COLORS.textPrimary,
    marginBottom: 10,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: APP_COLORS.surface,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: APP_COLORS.textPrimary,
    padding: 0,
  },
  inputLabel: {
    fontSize: 15,
    color: APP_COLORS.textSecondary,
    marginLeft: 10,
  },
  totalBox: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: APP_COLORS.error,
    textAlign: 'center',
    marginTop: 4,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#f0f0f5',
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: APP_COLORS.primary, // ✅ Фиолетовая кнопка "Далее"!
  },
  navButtonText: {
    color: APP_COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});