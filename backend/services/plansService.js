const { env } = require("../config/env");
const { Pool } = require("pg");

const isPostgresUrl = (value) => /^postgres(ql)?:\/\//i.test(String(value || ""));

let plansPool;

const getSupabaseRestUrl = () => {
  if (!env.supabaseUrl) return "";

  if (!isPostgresUrl(env.supabaseUrl)) {
    return env.supabaseUrl;
  }

  try {
    const { hostname } = new URL(env.supabaseUrl);
    if (hostname.startsWith("db.")) {
      return `https://${hostname.slice(3)}`;
    }
  } catch {
    return "";
  }

  return "";
};

const getPlansPool = () => {
  const connectionString = env.supabaseDbUrl || (isPostgresUrl(env.supabaseUrl) ? env.supabaseUrl : "");

  if (!connectionString) {
    const error = new Error("Supabase database connection is not configured");
    error.statusCode = 502;
    throw error;
  }

  if (!plansPool) {
    plansPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }

  return plansPool;
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || data?.error || "Unable to fetch pricing plans.");
    error.statusCode = 502;
    throw error;
  }

  return data;
};

const fetchPlansFromSupabase = async () => {
  const supabaseRestUrl = getSupabaseRestUrl();

  if (!supabaseRestUrl || !env.supabaseKey) {
    const error = new Error("Supabase pricing configuration is not configured");
    error.statusCode = 502;
    throw error;
  }

  const headers = {
    apikey: env.supabaseKey,
    Authorization: `Bearer ${env.supabaseKey}`,
  };

  const [plans, features] = await Promise.all([
    fetchJson(`${supabaseRestUrl}/rest/v1/plans?select=*&order=created_at.asc`, { headers }),
    fetchJson(`${supabaseRestUrl}/rest/v1/plan_features?select=*&order=display_order.asc`, { headers }),
  ]);

  const featuresByPlanId = features.reduce((groups, feature) => {
    const planId = feature.plan_id;
    if (!planId) return groups;

    return {
      ...groups,
      [planId]: [...(groups[planId] || []), feature],
    };
  }, {});

  return plans.map((plan) => ({
    ...plan,
    features: featuresByPlanId[plan.id] || [],
  }));
};

const fetchPlansFromDatabase = async () => {
  const pool = getPlansPool();
  const [plansResult, featuresResult] = await Promise.all([
    pool.query(
      "select id, name, price, duration, description, created_at from public.plans order by created_at asc"
    ),
    pool.query(
      "select id, plan_id, feature_name, category_name, tier, display_order, created_at from public.plan_features order by display_order asc, created_at asc"
    ),
  ]);

  const featuresByPlanId = featuresResult.rows.reduce((groups, feature) => {
    const planId = feature.plan_id;
    if (!planId) return groups;

    return {
      ...groups,
      [planId]: [...(groups[planId] || []), feature],
    };
  }, {});

  return plansResult.rows.map((plan) => ({
    ...plan,
    features: featuresByPlanId[plan.id] || [],
  }));
};

const fetchPlansFromCrm = async () => {
  if (!env.crmApiBaseUrl) {
    const error = new Error("CRM API base URL is not configured");
    error.statusCode = 502;
    throw error;
  }

  return fetchJson(`${env.crmApiBaseUrl}/plans`);
};

const fetchPricingPlans = async () => {
  if (getSupabaseRestUrl() && env.supabaseKey) {
    return fetchPlansFromSupabase();
  }

  if (env.supabaseDbUrl || isPostgresUrl(env.supabaseUrl)) {
    return fetchPlansFromDatabase();
  }

  return fetchPlansFromCrm();
};

module.exports = {
  fetchPricingPlans,
  fetchPlansFromDatabase,
  fetchPlansFromCrm: fetchPricingPlans,
};
