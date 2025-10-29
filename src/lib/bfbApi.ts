import api from "./api";

const BASE_URL = "https://www.api.bfb.projection-learn.website";

export type FaqCategory = {
  id: number;
  name: string;
  slug: string;
};

export type FaqItem = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
};

export type EventPost = {
  id: number;
  title?: { rendered?: string };
  content?: { rendered?: string };
  acf?: Record<string, unknown>;
};

export type MainCoursePost = {
  id: number;
  title?: { rendered?: string };
  acf?: {
    Is_online?: number | string;
    Course_include?: string[];
    What_learn?: string[];
    Price?: string | number;
    Price_old?: string | number;
    About?: string;
  } & Record<string, unknown>;
};

export type CourseData = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  course_data: {
    Course_themes: string[];
    What_learn: string[];
    Course_include: string[];
    Course_program: Array<{
      hl_input_text_title: string;
      hl_input_text_lesson_count: string;
      hl_textarea_description: string;
      hl_textarea_themes: string;
    }>;
    Date_start: string | null;
    Duration: string | null;
    Blocks: string | null;
    Course_coach: {
      ID: number;
      title: string;
      input_text_experience: string;
      input_text_status: string;
      input_text_status_1: string;
      input_text_status_2: string;
      input_text_count_training: string;
      input_text_history: string;
      input_text_certificates: string;
      input_text_link_instagram: string;
      input_text_text_instagram: string;
      textarea_description: string;
      textarea_about_me: string;
      textarea_my_mission: string;
      img_link_avatar: string;
      point_specialization: string;
    } | null;
    Required_equipment: string | null;
    Online_lessons: string | null;
  };
};

async function safeFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

export async function fetchFaqCategories(): Promise<FaqCategory[]> {
  return safeFetch<FaqCategory[]>(`${BASE_URL}/wp-json/wp/v2/faq_category`);
}

export async function fetchFaqByCategory(
  categoryId?: number
): Promise<FaqItem[]> {
  const qs = categoryId ? `?faq_category=${categoryId}` : "";
  return safeFetch<FaqItem[]>(`/api/faq${qs}`);
}

export async function fetchCourse(courseId?: number): Promise<CourseData> {
  const qs = courseId ? `?id=${courseId}` : "";
  return safeFetch<CourseData>(`/api/course${qs}`);
}

export async function fetchEvents(): Promise<EventPost[]> {
  return safeFetch<EventPost[]>(`${BASE_URL}/wp-json/wp/v2/events`);
}

export async function fetchMainCourses(): Promise<MainCoursePost[]> {
  return safeFetch<MainCoursePost[]>(`${BASE_URL}/wp-json/wp/v2/main_courses`);
}

export type BannerPost = {
  id: number;
  title?: { rendered?: string };
  acf?: Record<string, unknown>;
};

export async function fetchBanners(): Promise<BannerPost[]> {
  return safeFetch<BannerPost[]>(`${BASE_URL}/wp-json/wp/v2/banner`);
}

// Видаляємо неіснуючі ендпоінти

export type ThemeSettingsPost = {
  id: number;
  acf?: {
    input_text_phone?: string;
    input_text_schedule?: string;
    input_text_email?: string;
    input_text_address?: string;
    hl_data_contact?: Array<{
      hl_input_text_name?: string;
      hl_input_text_link?: string;
      hl_img_svg_icon?: string;
    }>;
    hl_data_gallery?: Array<{
      hl_img_link_photo?: string[];
    }>;
    map_markers?: Array<{
      title?: string;
      coordinates?: number[][];
    }>;
    user_city?: string[];
    user_country?: string[];
  };
};

export async function fetchThemeSettings(): Promise<ThemeSettingsPost[]> {
  return safeFetch<ThemeSettingsPost[]>(
    `${BASE_URL}/wp-json/wp/v2/theme_settings`
  );
}

// Видаляємо неіснуючі ендпоінти calculator та board

export type CoursePost = {
  id: number;
  title: { rendered: string };
  acf?: {
    course_data?: {
      Course_themes?: string[];
      What_learn?: string[];
      Course_include?: string[];
      Course_program?: Array<{
        hl_input_text_title?: string;
        hl_input_text_lesson_count?: string;
        hl_textarea_description?: string;
        hl_textarea_themes?: string;
      }>;
      Date_start?: string;
      Duration?: string;
      Blocks?: string;
      Course_coach?: {
        ID?: number;
        first_name?: string;
        last_name?: string;
        avatar?: string;
        Experience?: string;
        Super_power?: string;
        Training_conducted?: string;
        Stories_of_transformations?: string;
        Social_media?: {
          telegram?: string;
          phone?: string;
          instagram?: string;
        };
      };
      Required_equipment?: string;
      Online_lessons?: string;
    };
    Is_online?: number;
  };
};

export async function fetchCourses(): Promise<CoursePost[]> {
  return safeFetch<CoursePost[]>(`${BASE_URL}/wp-json/wp/v2/main_courses`);
}

export type InstructorPost = {
  id: number;
  title: { rendered: string };
  acf?: {
    position?: string;
    experience?: string;
    location_city?: string;
    location_country?: string;
    social_phone?: string;
    social_telegram?: string;
    social_instagram?: string;
    boards?: string;
    super_power?: string;
    gallery?: string;
    certificate?: string[];
    avatar?: string;
    favourite_exercise?: string[];
    my_specialty?: string[];
    my_experience?: Array<{
      hl_input_text_gym?: string;
      hl_input_date_date_start?: string;
      hl_input_date_date_end?: string;
      hl_textarea_ex_description?: string;
    }>;
    my_wlocation?: Array<{
      hl_input_text_title?: string;
      hl_input_text_email?: string;
      hl_input_text_phone?: string;
      hl_input_text_schedule_five?: string;
      hl_input_text_schedule_two?: string;
      hl_input_text_address?: string;
    }>;
  };
};

export async function fetchInstructor(id: number): Promise<InstructorPost> {
  return safeFetch<InstructorPost>(
    `${BASE_URL}/wp-json/wp/v2/instructors/${id}`
  );
}

export type CasePost = {
  id: number;
  title?: { rendered?: string };
  Avatar?: string;
  Text_instagram?: string;
  Description?: string;
};

export async function fetchCases(): Promise<CasePost[]> {
  return safeFetch<CasePost[]>(`${BASE_URL}/wp-json/wp/v2/cases`);
}

export type TariffPost = {
  id: number;
  title: { rendered: string };
  acf?: {
    tariff_name?: string;
    tariff_price?: string;
    tariff_discount?: string;
    tariff_period?: string;
    tariff_features?: string[];
    tariff_popular?: boolean;
    tariff_popular_text?: string;
  };
};

export type UserCategoryPost = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  count: number;
};

export async function fetchUserCategories(): Promise<UserCategoryPost[]> {
  return safeFetch<UserCategoryPost[]>(
    `${BASE_URL}/wp-json/wp/v2/user_category`
  );
}

export type ApplicationData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: "question" | "training";
};

export async function submitApplication(
  data: ApplicationData
): Promise<{ success: boolean; message: string }> {
  try {
    const endpoint =
      data.type === "question"
        ? "/api/applications/question"
        : "/api/applications/training";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await response.json();
    return { success: true, message: "Заявка успішно відправлена" };
  } catch (error) {
    console.error("[API] Error submitting application:", error);
    throw new Error("Не вдалося відправити заявку");
  }
}

export async function submitContactQuestion(payload: {
  name: string;
  email?: string;
  phone?: string;
  nickname?: string;
  question?: string;
}) {
  const endpoint = `/api/applications/question`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export type PurchasedProduct = {
  id: number;
  name: string;
  price: string;
  image: string;
  purchase_date: string;
  status: string;
};

export type Tariff = {
  id: number;
  title: { rendered: string };
  Price: string;
  Time: string;
  Points: Array<{
    Статус: string;
    Текст: string;
  }>;
};

export async function fetchTariffs(): Promise<Tariff[]> {
  try {
    const response = await fetch(`${BASE_URL}/wp-json/wp/v2/tariff`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Error fetching tariffs:", error);
    throw new Error("Не вдалося завантажити тарифи");
  }
}

export async function fetchPurchasedProducts(
  userId: number,
  token?: string
): Promise<PurchasedProduct[]> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${BASE_URL}/wp-json/custom/v1/purchased-products?user_id=${userId}&product_list=true`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Error fetching purchased products:", error);
    throw new Error("Не вдалося завантажити придбані курси");
  }
}

export type InstructorAdvantagePost = {
  id: number;
  title: { rendered: string };
  acf?: {
    advantage_title?: string;
    advantage_description?: string;
    advantage_icons?: string[];
    advantage_images?: string[];
    advantage_has_icons?: boolean;
    advantage_has_images?: boolean;
    advantage_visual_type?: string;
  };
};

export async function fetchInstructorAdvantages(): Promise<
  InstructorAdvantagePost[]
> {
  return safeFetch<InstructorAdvantagePost[]>(
    `${BASE_URL}/wp-json/wp/v2/instructor_advantages`
  );
}

export type WooCommerceCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  } | null;
  menu_order: number;
  count: number;
};

export async function fetchProductCategories(): Promise<WooCommerceCategory[]> {
  try {
    // Отримуємо категорії товарів (фізичні товари) з батьківською категорією 77
    const response = await fetch(
      "/api/wc/products/categories?parent=77&per_page=100"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Error fetching product categories:", error);
    throw new Error("Не вдалося завантажити категорії товарів");
  }
}

// Отримання категорій тренувань (батьківська категорія 55)
export async function fetchTrainingCategories(): Promise<
  WooCommerceCategory[]
> {
  try {
    const response = await fetch(
      "/api/wc/products/categories?parent=55&per_page=100"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Error fetching training categories:", error);
    throw new Error("Не вдалося завантажити категорії тренувань");
  }
}

// Отримання категорій курсів (батьківська категорія 72)
export async function fetchCourseCategories(): Promise<WooCommerceCategory[]> {
  try {
    const response = await fetch(
      "/api/wc/products/categories?parent=72&per_page=100"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("[CourseCategories] response:", data);
    return data;
  } catch (error) {
    console.error("[API] Error fetching course categories:", error);
    throw new Error("Не вдалося завантажити категорії курсів");
  }
}

// Отримання категорій FAQ
export async function fetchFAQCategories(): Promise<unknown[]> {
  try {
    const response = await fetch(`${BASE_URL}/wp-json/wp/v2/faq_category`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("[FAQCategories] response:", data);
    return data;
  } catch (error) {
    console.error("[API] Error fetching FAQ categories:", error);
    throw new Error("Не вдалося завантажити категорії FAQ");
  }
}

// Отримання FAQ з фільтрацією за категорією
export async function fetchFilteredFAQ(
  categoryId?: string
): Promise<unknown[]> {
  try {
    const url = categoryId
      ? `${BASE_URL}/wp-json/wp/v2/faq?faq_category=${categoryId}`
      : `${BASE_URL}/wp-json/wp/v2/faq`;

    console.log("[FilteredFAQ] fetching:", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("[FilteredFAQ] response:", data);
    return data;
  } catch (error) {
    console.error("[API] Error fetching filtered FAQ:", error);
    throw new Error("Не вдалося завантажити FAQ");
  }
}

// Отримання атрибутів товарів (колір, розмір, тощо)
export async function fetchProductAttributes(): Promise<
  WooCommerceAttribute[]
> {
  try {
    const response = await fetch("/api/wc/products/attributes");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Error fetching product attributes:", error);
    throw new Error("Не вдалося завантажити атрибути товарів");
  }
}

// Отримання термінів (опцій) атрибуту
export async function fetchAttributeTerms(
  attributeId: number
): Promise<WooCommerceAttributeTerm[]> {
  try {
    const response = await fetch(
      `/api/wc/products/attributes/${attributeId}/terms`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `[API] Error fetching attribute terms for ${attributeId}:`,
      error
    );
    throw new Error("Не вдалося завантажити опції атрибуту");
  }
}

export type WooCommerceAttribute = {
  id: number;
  name: string;
  slug: string;
  type: string;
  order_by: string;
  has_archives: boolean;
};

export type WooCommerceAttributeTerm = {
  id: number;
  name: string;
  slug: string;
  description: string;
  menu_order: number;
  count: number;
};

export type PasswordResetData = {
  email: string;
};

export type PasswordResetResponse = {
  success: boolean;
  message: string;
};

export async function requestPasswordReset(
  data: PasswordResetData
): Promise<PasswordResetResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/wp-json/bdpwr/v1/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("[PasswordReset] response:", result);
    return { success: true, message: "Код відновлення відправлено на email" };
  } catch (error) {
    console.error("[API] Error requesting password reset:", error);
    throw new Error("Не вдалося відправити код відновлення");
  }
}

export type ValidateCodeData = {
  email: string;
  code: string;
};

export async function validateResetCode(
  data: ValidateCodeData
): Promise<PasswordResetResponse> {
  try {
    const response = await fetch(`${BASE_URL}/wp-json/bdpwr/v1/validate-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("[ValidateCode] response:", result);
    return { success: true, message: "Код підтверджено" };
  } catch (error) {
    console.error("[API] Error validating code:", error);
    throw new Error("Не вдалося підтвердити код");
  }
}

export type SetPasswordData = {
  email: string;
  code: string;
  password: string;
};

export async function setNewPassword(
  data: SetPasswordData
): Promise<PasswordResetResponse> {
  try {
    const response = await fetch(`${BASE_URL}/wp-json/bdpwr/v1/set-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("[SetPassword] response:", result);
    return { success: true, message: "Пароль успішно змінено" };
  } catch (error) {
    console.error("[API] Error setting password:", error);
    throw new Error("Не вдалося встановити новий пароль");
  }
}

export type WooCommerceOrder = {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note: string;
  date_completed: string | null;
  date_paid: string | null;
  cart_hash: string;
  number: string;
  meta_data: Array<{
    id: number;
    key: string;
    value: string;
  }>;
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: Array<{
      id: number;
      total: string;
      subtotal: string;
    }>;
    meta_data: Array<{
      id: number;
      key: string;
      value: string;
    }>;
    sku: string;
    price: number;
  }>;
  tax_lines: Array<{
    id: number;
    rate_code: string;
    rate_id: number;
    label: string;
    compound: boolean;
    tax_total: string;
    shipping_tax_total: string;
    meta_data: Array<{
      id: number;
      key: string;
      value: string;
    }>;
  }>;
  shipping_lines: Array<{
    id: number;
    method_title: string;
    method_id: string;
    total: string;
    total_tax: string;
    taxes: Array<{
      id: number;
      total: string;
      subtotal: string;
    }>;
    meta_data: Array<{
      id: number;
      key: string;
      value: string;
    }>;
  }>;
  fee_lines: Array<{
    id: number;
    name: string;
    tax_class: string;
    tax_status: string;
    total: string;
    total_tax: string;
    taxes: Array<{
      id: number;
      total: string;
      subtotal: string;
    }>;
    meta_data: Array<{
      id: number;
      key: string;
      value: string;
    }>;
  }>;
  coupon_lines: Array<{
    id: number;
    code: string;
    discount: string;
    discount_tax: string;
    meta_data: Array<{
      id: number;
      key: string;
      value: string;
    }>;
  }>;
  refunds: Array<{
    id: number;
    reason: string;
    total: string;
  }>;
  payment_url: string;
  is_editable: boolean;
  needs_payment: boolean;
  needs_processing: boolean;
  date_created_gmt: string;
  date_modified_gmt: string;
  date_completed_gmt: string | null;
  date_paid_gmt: string | null;
  currency_symbol: string;
};

export async function fetchUserOrders(
  userId: number
): Promise<WooCommerceOrder[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/wp-json/wc/v3/orders?customer=${userId}`,
      {
        headers: {
          Authorization: "Bearer " + "your-jwt-token", // JWT token
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("[UserOrders] response:", data);
    return data;
  } catch (error) {
    console.error("[API] Error fetching user orders:", error);
    throw new Error("Не вдалося завантажити історію замовлень");
  }
}

export type MediaUploadData = {
  file: File;
  fieldType:
    | "img_link_data_avatar"
    | "img_link_data_gallery_"
    | "img_link_data_certificate";
  token: string;
};

export type MediaUploadResponse = {
  success: boolean;
  message: string;
  url?: string;
  id?: number;
};

export async function uploadMedia(
  data: MediaUploadData
): Promise<MediaUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("field_type", data.fieldType);
    formData.append("token", data.token);

    const response = await fetch(`${BASE_URL}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("[MediaUpload] response:", result);

    return {
      success: true,
      message: "Файл успішно завантажено",
      url: result.source_url,
      id: result.id,
    };
  } catch (error) {
    console.error("[API] Error uploading media:", error);
    throw new Error("Не вдалося завантажити файл");
  }
}

// Custom media upload for coach fields (avatar/gallery/certificate)
export async function uploadCoachMedia(params: {
  token: string;
  fieldType:
    | "img_link_data_avatar"
    | "img_link_data_gallery_"
    | "img_link_data_certificate_";
  files: File[];
}): Promise<{
  success: boolean;
  field_type?: string;
  processed_count?: number;
  files?: Array<{ id: string | number; url: string; filename?: string }>;
  current_field_value?: string;
}> {
  const form = new FormData();
  form.append("token", params.token);
  form.append("field_type", params.fieldType);
  for (const f of params.files) form.append("files", f);

  const res = await fetch(
    `https://www.api.bfb.projection-learn.website/wp-json/custom/v1/upload-media`,
    {
      method: "POST",
      body: form,
    }
  );
  const data: {
    success?: boolean;
    field_type?: string;
    processed_count?: number;
    files?: Array<{ id: string | number; url: string; filename?: string }>;
    current_field_value?: string;
    message?: string;
  } = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.message || `uploadCoachMedia failed with status ${res.status}`
    );
  }
  return data as {
    success: boolean;
    field_type?: string;
    processed_count?: number;
    files?: Array<{ id: string | number; url: string; filename?: string }>;
    current_field_value?: string;
  };
}

export type ProductFilters = {
  category?: string | string[];
  attribute?: string | string[];
  attribute_term?: string | string[];
  min_price?: number;
  max_price?: number;
  on_sale?: boolean;
  featured?: boolean;
  status?: string;
  search?: string;
  orderby?: "date" | "price" | "popularity" | "rating" | "title";
  order?: "asc" | "desc";
  per_page?: number;
  page?: number;
};

// Функція для отримання категорій товару з WordPress API
export async function fetchProductCategoriesFromWp(
  productId: number
): Promise<Array<{ id: number; name: string; slug: string }>> {
  try {
    const response = await fetch(`/api/wp/products/${productId}`);
    if (!response.ok) return [];
    const product = await response.json();
    return product.categories || [];
  } catch (error) {
    console.error(
      `[fetchProductCategoriesFromWp] Помилка для товару ${productId}:`,
      error
    );
    return [];
  }
}

export async function fetchFilteredProducts(
  filters: ProductFilters = {}
): Promise<unknown[]> {
  try {
    const params = new URLSearchParams();

    // Додаємо параметри фільтрації
    if (filters.category) {
      if (Array.isArray(filters.category)) {
        filters.category.forEach((cat) => params.append("category", cat));
      } else {
        params.append("category", filters.category);
      }
    }
    if (filters.attribute) {
      if (Array.isArray(filters.attribute)) {
        filters.attribute.forEach((attr) => params.append("attribute", attr));
      } else {
        params.append("attribute", filters.attribute);
      }
    }
    if (filters.attribute_term) {
      if (Array.isArray(filters.attribute_term)) {
        filters.attribute_term.forEach((term) =>
          params.append("attribute_term", term)
        );
      } else {
        params.append("attribute_term", filters.attribute_term);
      }
    }
    if (filters.min_price)
      params.append("min_price", filters.min_price.toString());
    if (filters.max_price)
      params.append("max_price", filters.max_price.toString());
    if (filters.on_sale !== undefined)
      params.append("on_sale", filters.on_sale.toString());
    if (filters.featured !== undefined)
      params.append("featured", filters.featured.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.orderby) params.append("orderby", filters.orderby);
    if (filters.order) params.append("order", filters.order);
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());
    if (filters.page) params.append("page", filters.page.toString());

    const queryString = params.toString();

    // Використовуємо WooCommerce v3 API для всіх запитів
    const url = `/api/wc/v3/products${queryString ? `?${queryString}` : ""}`;

    const extraHeaders: Record<string, string> = {};
    // Forward JWT to proxy if available
    try {
      if (typeof window !== "undefined") {
        const jwt = localStorage.getItem("wp_jwt");
        if (jwt) {
          extraHeaders["x-wp-jwt"] = jwt; // for our proxy convenience
          extraHeaders["Authorization"] = `Bearer ${jwt}`; // proxy prioritizes Authorization
        }
      }
    } catch {}

    const response = await fetch(url, { headers: extraHeaders });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Додаємо mapProductToUi для отримання dateCreated
    const { mapProductToUi } = await import("./products");
    return data.map(mapProductToUi);
  } catch (error) {
    console.error("[API] Error fetching filtered products:", error);
    throw new Error("Не вдалося завантажити відфільтровані товари");
  }
}

// Trainer profile update
export interface TrainerProfileUpdatePayload {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  meta?: Record<string, unknown>;
}

export async function updateTrainerProfile(
  payload: TrainerProfileUpdatePayload,
  bearerToken?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (bearerToken) headers.Authorization = `Bearer ${bearerToken}`;
  const res = await fetch("/api/profile/trainer", {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update trainer profile");
  }
  return res.json();
}

// WooCommerce product reviews
export interface WcReview {
  id: number;
  product_id: number;
  review: string;
  reviewer_name?: string;
  date_created?: string;
  rating?: number;
}

export async function fetchWcReviews(params?: Record<string, string | number>) {
  const qs = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  const res = await fetch(`/api/wc/reviews${qs}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

export async function createWcReview(body: {
  product_id: number;
  review: string;
  reviewer: string;
  reviewer_email: string;
  rating: number;
}) {
  const res = await fetch(`/api/wc/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create review");
  return res.json();
}

// WooCommerce products and categories (proxying our API routes)
export async function fetchWcProducts(
  params?: Record<string, string | number>
) {
  const qs = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  const res = await fetch(`/api/wc/products${qs}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchWcCategories(
  params?: Record<string, string | number>
) {
  const qs = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  const res = await fetch(`/api/wc/products/categories${qs}`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

// FAQ Functions with logging
export async function fetchFAQCategoriesWithLogging(): Promise<FaqCategory[]> {
  try {
    console.log("[FAQ] 🚀 Завантажую категорії FAQ...");
    const data = await fetchFaqCategories();
    console.log("[FAQ] ✅ Отримано категорії FAQ:", data);
    return data;
  } catch (error) {
    console.error("[FAQ] ❌ Помилка завантаження категорій FAQ:", error);
    throw new Error("Не вдалося завантажити категорії FAQ");
  }
}

export async function fetchFAQByCategoryWithLogging(
  categoryId?: number
): Promise<FaqItem[]> {
  try {
    console.log("[FAQ] 🚀 Завантажую FAQ по категорії:", categoryId);
    const data = await fetchFaqByCategory(categoryId);

    // Детальне логування структури даних
    console.log("[FAQ] 📊 Кількість FAQ елементів:", data.length);
    console.log(
      "[FAQ] 🔍 Повна структура даних:",
      JSON.stringify(data, null, 2)
    );

    if (data.length > 0) {
      console.log("[FAQ] 📋 Перший елемент детально:");
      console.log("[FAQ] - ID:", data[0].id);
      console.log("[FAQ] - Title:", data[0].title);
      console.log("[FAQ] - Content:", data[0].content);
      console.log("[FAQ] - Всі ключі об'єкта:", Object.keys(data[0]));

      // Перевіряємо чи є додаткові поля
      const allKeys = data.flatMap((item) => Object.keys(item));
      const uniqueKeys = [...new Set(allKeys)];
      console.log("[FAQ] 🔑 Всі унікальні ключі в даних:", uniqueKeys);
    }

    console.log("[FAQ] ✅ Отримано FAQ:", data);
    return data;
  } catch (error) {
    console.error("[FAQ] ❌ Помилка завантаження FAQ:", error);
    throw new Error("Не вдалося завантажити FAQ");
  }
}

// Trainer Types
export interface Trainer {
  id: number;
  name: string;
  slug: string;
  description?: string;
  avatar_urls?: {
    "24": string;
    "48": string;
    "96": string;
  };
  acf?: {
    full_name?: string;
    bio?: string;
    avatar?: {
      url: string;
      alt: string;
    };
    location_city?: string;
    location_country?: string;
    experience?: string;
    position?: string;
    social_instagram?: string;
    social_telegram?: string;
    social_phone?: string;
    certificate?: string;
    clients_count?: string;
    my_wlocation?: Array<{
      city: string;
      country: string;
    }>;
  };
}

export interface TrainerFilters {
  countries?: string[];
  cities?: string[];
  roles?: string[];
  categories?: number[];
}

// Trainer Functions
export async function fetchTrainersWithLogging(
  filters: TrainerFilters = {}
): Promise<Trainer[]> {
  try {
    const params = new URLSearchParams();

    // Додаємо фільтри до параметрів
    if (filters.countries && filters.countries.length > 0) {
      filters.countries.forEach((country) => {
        params.append("countries[]", country);
      });
    }

    if (filters.cities && filters.cities.length > 0) {
      filters.cities.forEach((city) => {
        params.append("cities[]", city);
      });
    }

    if (filters.roles && filters.roles.length > 0) {
      filters.roles.forEach((role) => {
        params.append("roles[]", role);
      });
    }

    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach((category) => {
        params.append("categories[]", category.toString());
      });
    }

    const queryString = params.toString();
    // За замовчуванням додаємо роль тренера
    const roleSuffix = queryString ? `&roles=bfb_coach` : `?roles=bfb_coach`;
    const url = `/api/trainers${
      queryString ? `?${queryString}` : ""
    }${roleSuffix}`;

    const data = await safeFetch<Trainer[]>(url);

    return data;
  } catch (error) {
    console.error("[Trainers] ❌ Помилка завантаження тренерів:", error);
    throw new Error("Не вдалося завантажити тренерів");
  }
}

// (duplicated CasePost removed)

// WooCommerce Orders API
export const createWcOrder = async (orderData: {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    address_1?: string;
    city: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1?: string;
    city: string;
    country: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
  shipping_lines?: Array<{
    method_id: string;
    method_title: string;
    total: string;
  }>;
  customer_note?: string;
}): Promise<unknown> => {
  try {
    console.log("[createWcOrder] 🚀 Створюю замовлення:", orderData);
    const response = await api.post("/api/wc/orders", orderData);
    console.log("[createWcOrder] ✅ Замовлення створено:", response.data);
    return response.data;
  } catch (error) {
    console.error("[createWcOrder] ❌ Помилка:", error);
    throw error;
  }
};

export const fetchWcPaymentGateways = async (): Promise<unknown[]> => {
  try {
    console.log("[fetchWcPaymentGateways] 🚀 Отримую платіжні методи");
    const response = await api.get("/api/wc/payment-gateways");
    console.log(
      "[fetchWcPaymentGateways] ✅ Отримано платіжних методів:",
      response.data?.length || 0
    );
    return response.data;
  } catch (error) {
    console.error("[fetchWcPaymentGateways] ❌ Помилка:", error);
    throw error;
  }
};
